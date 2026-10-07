(() => {
  'use strict';
  const data = window.LIONLINK_ROUTE_3D_DATA;
  const busModel = window.LIONLINK_BUS_MODEL;
  const overlayData = window.LIONLINK_STOP_OVERLAY_DATA;
  // Selected passenger-report records from Data/04_passenger_reports.xlsx.
  // A blank route means the report did not identify a service number.
  const reportedCases = [
    { id: 'PC01', routeId: 'B132_1', stopCode: '64009', issue: 'Warm bus / weak air conditioning', date: '2026-10-05' },
    { id: 'PC02', routeId: null, stopCode: '64009', issue: 'Warm bus / weak air conditioning; vehicle NW-V020 reported', date: '2026-10-12' },
    { id: 'PC03', routeId: 'B235_1', stopCode: '52009', issue: 'Expected service did not leave at the reported time', date: '2026-10-07' },
    { id: 'PC04', routeId: 'B235_1', stopCode: '52009', issue: 'Passenger reports a longer wait; boarded vehicle NW-V039', date: '2026-10-14' },
    { id: 'PC07', routeId: 'B238_1', stopCode: '52009', issue: 'Crowding; passenger could not board the first bus', date: '2026-10-06' },
  ];
  const canvas = document.getElementById('route-canvas');
  if (!canvas || !data || !busModel) return;
  const ctx = canvas.getContext('2d');
  const $ = (id) => document.getElementById(id);
  const slider = $('bus-progress');
  const state = { routeId: null, route: null, donorId: null, donorRoute: null, routeIds: [], routes: [], allocationBuses: 1, headway: 12, detailRouteId: null, date: '2026-10-05', overlays: {}, overlaysByRoute: {}, showCrowd: true, showLate: true, showReports: true, replayMode: 'before-after', disruption: null, yaw: -0.48, pitch: 0.82, zoom: 1, progress: 0, playing: true, selectedStop: 0, dragging: false, moved: false, last: null, hits: [] };
  const COLORS = { route: '#65d7b2', stop: '#f2c66d', selected: '#f4865f', busShadow: 'rgba(4,14,14,.38)' };

  function setMessage(title, detail) {
    $('selected-stop-title').textContent = title;
    $('selected-stop-detail').textContent = detail;
  }

  function prepareRoute(routeId) {
    const route = data.routes[routeId];
    if (!route || route.path.length < 2) return null;
    const visibleRoutes = (state.routeIds.length ? state.routeIds : [state.routeId, state.donorId]).map((id) => data.routes[id]).filter(Boolean);
    const allPoints = visibleRoutes.flatMap((item) => item.path);
    const xs = allPoints.map((p) => p[0]);
    const ys = allPoints.map((p) => p[1]);
    const minX = Math.min(...xs), maxX = Math.max(...xs);
    const minY = Math.min(...ys), maxY = Math.max(...ys);
    const cx = (minX + maxX) / 2, cy = (minY + maxY) / 2;
    const worldScale = 108 / Math.max(maxX - minX, maxY - minY, 1);
    const point = (xy, z = 0) => [(xy[0] - cx) * worldScale, (cy - xy[1]) * worldScale, z];
    const path = route.path.map((p) => point(p, 0.1));
    const stops = route.stops.map((stop, i) => ({ ...stop, order: stop.seq || i + 1, world: point(stop.xy, 0.1) }));
    const cumulative = [0];
    for (let i = 1; i < path.length; i += 1) {
      const dx = path[i][0] - path[i - 1][0], dy = path[i][1] - path[i - 1][1];
      cumulative.push(cumulative[i - 1] + Math.hypot(dx, dy));
    }
    return { ...route, routeId, worldPath: path, worldStops: stops, cumulative, totalLength: cumulative.at(-1) || 1 };
  }

  function busAt(route, progress) {
    const path = route.worldPath;
    const cumulative = route.cumulative;
    const distance = route.totalLength * progress;
    let index = 1;
    while (index < cumulative.length - 1 && cumulative[index] < distance) index += 1;
    const start = path[index - 1], end = path[index];
    const segment = cumulative[index] - cumulative[index - 1] || 1;
    const t = Math.max(0, Math.min(1, (distance - cumulative[index - 1]) / segment));
    return {
      x: start[0] + (end[0] - start[0]) * t,
      y: start[1] + (end[1] - start[1]) * t,
      angle: Math.atan2(end[1] - start[1], end[0] - start[0]) - Math.PI / 2,
    };
  }

  function cameraPoint(point) {
    const [x, y, z] = point;
    const c = Math.cos(state.yaw), s = Math.sin(state.yaw);
    const x1 = x * c - y * s;
    const y1 = x * s + y * c;
    const cp = Math.cos(state.pitch), sp = Math.sin(state.pitch);
    const vertical = y1 * cp + z * sp;
    const depth = y1 * sp - z * cp;
    const distance = 245 / state.zoom;
    const perspective = 310 / Math.max(48, distance + depth);
    return { x: canvas.clientWidth / 2 + x1 * perspective, y: canvas.clientHeight * 0.51 - vertical * perspective, depth };
  }

  function pathOnCanvas(points, stroke, width, alpha = 1) {
    if (!points.length) return;
    ctx.beginPath();
    points.forEach((p, i) => {
      const q = cameraPoint(p);
      if (!i) ctx.moveTo(q.x, q.y); else ctx.lineTo(q.x, q.y);
    });
    ctx.globalAlpha = alpha;
    ctx.strokeStyle = stroke;
    ctx.lineWidth = width;
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';
    ctx.stroke();
    ctx.globalAlpha = 1;
  }

  function drawGround() {
    const corners = [[-78, -78, 0], [78, -78, 0], [78, 78, 0], [-78, 78, 0]].map(cameraPoint);
    const grad = ctx.createLinearGradient(0, 0, 0, canvas.clientHeight);
    grad.addColorStop(0, 'rgba(25,64,56,.32)');
    grad.addColorStop(1, 'rgba(8,22,22,.16)');
    ctx.beginPath(); corners.forEach((p, i) => i ? ctx.lineTo(p.x, p.y) : ctx.moveTo(p.x, p.y)); ctx.closePath();
    ctx.fillStyle = grad; ctx.fill();
    for (let i = -70; i <= 70; i += 14) {
      pathOnCanvas([[-70, i, 0.02], [70, i, 0.02]], '#83ad9c', 0.6, 0.1);
      pathOnCanvas([[i, -70, 0.02], [i, 70, 0.02]], '#83ad9c', 0.6, 0.1);
    }
  }

  function currentBusProgress(route, routeIndex) {
    if (state.disruption && state.disruption.routeId === route.routeId) {
      const replacement = replacementPosition(state.disruption);
      return replacement.enRoute ? null : replacement.progress;
    }
    return (state.progress + routeIndex * 0.13) % 1;
  }

  function drawWaitingCrowd(stop, base, queue, routeIndex, now) {
    const people = Math.max(0, Math.round(queue));
    const figures = Math.min(6, Math.ceil(people / 3));
    const color = people >= 15 ? '#f07862' : people >= 7 ? '#efb35e' : '#80ddb3';
    const x0 = base.x + 9 + routeIndex * 3;
    const footY = base.y - 1;
    ctx.save(); ctx.lineCap = 'round'; ctx.lineWidth = 1.25;
    for (let i = 0; i < figures; i += 1) {
      const x = x0 + i * 5;
      const bob = Math.sin(now / 260 + stop.order * 0.7 + i) * 0.7;
      const headY = footY - 8 + bob;
      ctx.beginPath(); ctx.arc(x, headY, 1.45, 0, Math.PI * 2); ctx.fillStyle = color; ctx.fill();
      ctx.strokeStyle = color; ctx.beginPath();
      ctx.moveTo(x, headY + 2); ctx.lineTo(x, footY - 3);
      ctx.moveTo(x - 2, footY - 6 + bob); ctx.lineTo(x, footY - 5 + bob); ctx.lineTo(x + 2, footY - 6 + bob);
      ctx.moveTo(x, footY - 3); ctx.lineTo(x - 1.5, footY); ctx.moveTo(x, footY - 3); ctx.lineTo(x + 1.5, footY);
      ctx.stroke();
    }
    const label = String(people);
    ctx.font = '700 7px -apple-system, BlinkMacSystemFont, sans-serif';
    const labelX = x0 + figures * 5 + 2;
    ctx.fillStyle = 'rgba(5,22,20,.78)'; ctx.fillRect(labelX, footY - 8, ctx.measureText(label).width + 5, 10);
    ctx.fillStyle = color; ctx.fillText(label, labelX + 2.5, footY - 1);
    ctx.restore();
  }

  function drawStops(now = performance.now()) {
    state.hits = [];
    const routeList = state.routes;
    for (let routeIndex = 0; routeIndex < routeList.length; routeIndex += 1) for (let i = 0; i < routeList[routeIndex].worldStops.length; i += 1) {
      const route = routeList[routeIndex];
      const stops = route.worldStops;
      const stop = route.worldStops[i];
      const base = cameraPoint([stop.world[0], stop.world[1], 0.1]);
      const top = cameraPoint([stop.world[0], stop.world[1], 4.5]);
      const selected = route.routeId === state.detailRouteId && i === state.selectedStop;
      const overlay = state.overlaysByRoute[route.routeId] || {};
      const info = overlay[stop.order] || {};
      if (state.showCrowd) {
        const busProgress = currentBusProgress(route, routeIndex);
        const firstKm = Number(stops[0]?.km), lastKm = Number(stops.at(-1)?.km);
        const stopKm = Number(stop.km);
        const stationProgress = Number.isFinite(stopKm) && Number.isFinite(firstKm) && Number.isFinite(lastKm) && lastKm !== firstKm
          ? (stopKm - firstKm) / (lastKm - firstKm) : i / Math.max(1, stops.length - 1);
        const before = Number(info.avgQueueBefore || 0), after = Number(info.avgQueueAfter || 0);
        let queue = before;
        if (busProgress !== null) {
          const blend = stationProgress <= 0 ? 1 : Math.max(0, Math.min(1, (busProgress - (stationProgress - 0.008)) / 0.016));
          queue = before + (after - before) * blend;
        }
        drawWaitingCrowd(stop, base, queue, routeIndex, now);
      }
      const cases = state.showReports ? reportedCases.filter((item) => item.stopCode === stop.code && (!item.routeId || item.routeId === route.routeId)) : [];
      const markerRadius = selected ? 5.5 : 3.6;
      if (state.showLate && Number(info.priorCalls) >= 5) {
        const share = Number(info.lateShare || 0);
        const ring = 6 + 8 * Math.sqrt(share);
        ctx.beginPath(); ctx.arc(top.x, top.y, ring, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(255,${Math.round(174 - share * 80)},105,${0.2 + share * 0.7})`;
        ctx.lineWidth = 1.5 + share * 2.4; ctx.stroke();
      }
      ctx.beginPath(); ctx.moveTo(base.x, base.y); ctx.lineTo(top.x, top.y);
      ctx.strokeStyle = selected ? COLORS.selected : 'rgba(247,204,118,.55)'; ctx.lineWidth = selected ? 1.8 : 1.1; ctx.stroke();
      ctx.beginPath(); ctx.arc(top.x, top.y, markerRadius, 0, Math.PI * 2);
      ctx.fillStyle = selected ? COLORS.selected : (route.routeId === state.routeId ? COLORS.stop : '#a7bad8'); ctx.fill();
      ctx.strokeStyle = 'rgba(255,255,255,.85)'; ctx.lineWidth = selected ? 1.5 : 0.9; ctx.stroke();
      cases.forEach((item, caseIndex) => {
        const text = item.id;
        ctx.font = '700 8px -apple-system, BlinkMacSystemFont, sans-serif';
        const width = ctx.measureText(text).width + 8;
        const x = top.x + 8;
        const y = top.y + 8 + caseIndex * 14;
        ctx.fillStyle = '#8b392f'; ctx.fillRect(x, y, width, 12);
        ctx.strokeStyle = '#ffc2a2'; ctx.lineWidth = 0.8; ctx.strokeRect(x, y, width, 12);
        ctx.fillStyle = '#fff5ec'; ctx.fillText(text, x + 4, y + 9);
      });
      state.hits.push({ x: top.x, y: top.y, index: i, radius: Math.max(markerRadius, 8), routeId: route.routeId });
      if (selected || i === 0 || i === stops.length - 1) {
        const label = selected ? `${route.service} · ${stop.seq}. ${stop.name}` : `${stop.seq}`;
        ctx.font = selected ? '600 10px -apple-system, BlinkMacSystemFont, sans-serif' : '9px -apple-system, BlinkMacSystemFont, sans-serif';
        const textWidth = ctx.measureText(label).width;
        ctx.fillStyle = 'rgba(6,22,21,.77)'; ctx.fillRect(top.x + 8, top.y - 11, textWidth + 10, 18);
        ctx.fillStyle = selected ? '#fff1df' : '#d4e5dc'; ctx.fillText(label, top.x + 13, top.y + 2);
      }
    }
  }

  function busWorldVertex(v, bus, scale = 2.4) {
    const c = Math.cos(bus.angle), s = Math.sin(bus.angle);
    const x = v[0] * scale, y = v[1] * scale;
    return [bus.x + x * c - y * s, bus.y + x * s + y * c, Math.max(0, v[2] + 0.5) * scale + 0.35];
  }

  function drawBus(route, progress, opacity = 1, accent = '#78e0b4', reverse = false) {
    if (!route) return;
    const bus = busAt(route, progress);
    if (reverse) bus.angle += Math.PI;
    const triangles = busModel.map((tri) => {
      const world = tri.v.map((v) => cameraPoint(busWorldVertex(v, bus)));
      return { points: world, color: tri.c, depth: world.reduce((a, p) => a + p.depth, 0) / world.length };
    }).sort((a, b) => b.depth - a.depth);
    const shadow = cameraPoint([bus.x, bus.y, 0.2]);
    ctx.beginPath(); ctx.ellipse(shadow.x, shadow.y + 5, 12 * state.zoom, 5 * state.zoom, 0, 0, Math.PI * 2);
    ctx.fillStyle = COLORS.busShadow; ctx.fill();
    ctx.globalAlpha = opacity;
    for (const tri of triangles) {
      ctx.beginPath(); tri.points.forEach((p, i) => i ? ctx.lineTo(p.x, p.y) : ctx.moveTo(p.x, p.y)); ctx.closePath();
      const [r, g, b] = tri.color.map((v) => Math.round(v * 255));
      ctx.fillStyle = `rgb(${r},${g},${b})`; ctx.fill();
      ctx.strokeStyle = 'rgba(5,20,20,.22)'; ctx.lineWidth = 0.45; ctx.stroke();
    }
    ctx.globalAlpha = 1;
    // Keep the moving vehicle easy to see against both route layers.
    const marker = cameraPoint([bus.x, bus.y, 4.8]);
    const forward = cameraPoint([bus.x + Math.cos(bus.angle) * 2, bus.y + Math.sin(bus.angle) * 2, 4.8]);
    const heading = Math.atan2(forward.y - marker.y, forward.x - marker.x);
    ctx.save(); ctx.translate(marker.x, marker.y); ctx.rotate(heading);
    ctx.fillStyle = accent; ctx.strokeStyle = '#09251e'; ctx.lineWidth = 1.4;
    ctx.beginPath(); ctx.rect(-9, -5, 18, 10); ctx.fill(); ctx.stroke();
    ctx.fillStyle = '#163f36'; ctx.fillRect(-5, -3, 4, 3); ctx.fillRect(1, -3, 4, 3);
    ctx.fillStyle = '#f2f7dc'; ctx.fillRect(6, -1, 2, 2);
    ctx.restore();
  }

  function drawRoute(route, primary) {
    if (!route) return;
    const stops = route.worldStops;
    pathOnCanvas(route.worldPath, 'rgba(4,15,17,.42)', primary ? 7 : 5, .65);
    for (let position = 0; position < stops.length; position += 1) {
      const startIndex = Math.floor(position / stops.length * (route.worldPath.length - 1));
      const endIndex = Math.floor((position + 1) / stops.length * (route.worldPath.length - 1));
      const chunk = route.worldPath.slice(startIndex, Math.max(startIndex + 2, endIndex + 1));
      const info = (state.overlaysByRoute[route.routeId] || {})[stops[position]?.order] || {};
      let loadRatio = Number(info.avgLoadRatio || 0);
      if (state.replayMode === 'before-after' && state.allocationBuses > 0) {
        if (route.routeId === state.routeId) loadRatio /= (1 + .18 * state.allocationBuses);
        else if (route.routeId === state.donorId) loadRatio *= (1 + .18 * state.allocationBuses);
      }
      if (state.disruption && route.routeId === state.disruption.routeId) loadRatio = Math.min(1.5, loadRatio * 1.45);
      let color = '#52c493';
      if (loadRatio >= 0.8) color = '#ef665d';
      else if (loadRatio >= 0.55) color = '#e7ad59';
      if (!primary && state.replayMode === 'before-after') color = '#7590a9';
      pathOnCanvas(chunk, color, primary ? 3.8 : 2.6, primary ? 0.96 : 0.74);
    }
  }

  function drawTransferBus() {
    if (state.disruption || !state.donorRoute || state.replayMode !== 'before-after' || !state.allocationBuses) return;
    const start = cameraPoint(state.donorRoute.worldStops[0].world);
    const end = cameraPoint(state.route.worldStops[0].world);
    const t = 0.5 + 0.5 * Math.sin(performance.now() / 1150);
    const x = start.x + (end.x - start.x) * t, y = start.y + (end.y - start.y) * t - 16;
    ctx.fillStyle = '#96e0a5'; ctx.strokeStyle = '#123c2b'; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.rect(x - 7, y - 4, 15, 9); ctx.fill(); ctx.stroke();
    ctx.fillStyle = '#123c2b'; ctx.fillRect(x - 4, y - 2, 4, 3); ctx.fillRect(x + 1, y - 2, 4, 3);
  }

  function outageReturn(failure, now = performance.now()) {
    const elapsed = Math.max(0, now - failure.startedAt);
    const t = Math.min(1, elapsed / failure.returnDuration);
    const progress = failure.endIndex === 0
      ? failure.failureProgress * (1 - t)
      : failure.failureProgress + (1 - failure.failureProgress) * t;
    return { progress, complete: t >= 1 };
  }

  function replacementPosition(failure, now = performance.now()) {
    const elapsed = Math.max(0, now - failure.startedAt);
    const dispatchT = Math.min(1, elapsed / failure.dispatchDuration);
    if (dispatchT < 1) {
      const startProgress = failure.endIndex === 0 ? 0 : 1;
      return {
        progress: startProgress + (failure.failureProgress - startProgress) * dispatchT,
        enRoute: true,
        reverse: failure.endIndex !== 0,
      };
    }
    const serviceProgress = (elapsed - failure.dispatchDuration) / 30000;
    return { progress: (failure.failureProgress + serviceProgress) % 1, enRoute: false, reverse: false };
  }

  function drawScenarioTag(point, label, background, foreground = '#fff') {
    ctx.font = '700 8px -apple-system, BlinkMacSystemFont, sans-serif';
    const width = ctx.measureText(label).width + 12;
    ctx.fillStyle = background; ctx.fillRect(point.x - width / 2, point.y - 24, width, 15);
    ctx.strokeStyle = 'rgba(255,255,255,.8)'; ctx.lineWidth = 0.8; ctx.strokeRect(point.x - width / 2, point.y - 24, width, 15);
    ctx.fillStyle = foreground; ctx.textAlign = 'center'; ctx.fillText(label, point.x, point.y - 13); ctx.textAlign = 'start';
  }

  function kmPerWorldUnit() {
    const scales = state.routes.map((route) => {
      const firstKm = Number(route.worldStops[0]?.km);
      const lastKm = Number(route.worldStops.at(-1)?.km);
      return Number.isFinite(firstKm) && Number.isFinite(lastKm) && route.totalLength > 0
        ? Math.abs(lastKm - firstKm) / route.totalLength : 0;
    }).filter((value) => value > 0);
    return scales.length ? scales.reduce((sum, value) => sum + value, 0) / scales.length : 0;
  }

  function formatApproxDistance(worldDistance) {
    const km = worldDistance * kmPerWorldUnit();
    if (!km) return 'distance n/a';
    return km < 1 ? `~${Math.max(50, Math.round(km * 1000 / 50) * 50)} m` : `~${km.toFixed(1)} km`;
  }

  function drawBreakdown(now) {
    const failure = state.disruption;
    if (!failure) return;
    const route = state.routes.find((item) => item.routeId === failure.routeId);
    if (!route) return;
    const returned = outageReturn(failure, now);
    const bus = busAt(route, returned.progress);
    const point = cameraPoint([bus.x, bus.y, 4.8]);
    const origin = cameraPoint([failure.failurePoint.x, failure.failurePoint.y, 1]);
    ctx.beginPath(); ctx.arc(origin.x, origin.y, 11 + Math.sin(now / 220) * 2, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(244,94,83,.2)'; ctx.fill(); ctx.strokeStyle = '#fa7569'; ctx.lineWidth = 2; ctx.stroke();
    drawScenarioTag(origin, 'BREAKDOWN', '#9c392f');
    drawScenarioTag(point, returned.complete ? 'OUT OF SERVICE' : 'RETURNING TO INTERCHANGE', '#9c392f');
    const end = cameraPoint(route.worldStops[failure.endIndex].world);
    ctx.beginPath(); ctx.arc(end.x, end.y, 10, 0, Math.PI * 2); ctx.strokeStyle = '#f7bb69'; ctx.lineWidth = 2; ctx.stroke();
    if (returned.complete) { ctx.fillStyle = '#ff7164'; ctx.font = '700 19px -apple-system, BlinkMacSystemFont, sans-serif'; ctx.textAlign = 'center'; ctx.fillText('×', point.x + 12, point.y - 7); ctx.textAlign = 'start'; }
  }

  function drawReplacementBus(now) {
    const failure = state.disruption;
    if (!failure) return;
    const route = state.routes.find((item) => item.routeId === failure.routeId);
    if (!route) return;
    const replacement = replacementPosition(failure, now);
    drawBus(route, replacement.progress, 1, '#a3edac', replacement.reverse);
    const bus = busAt(route, replacement.progress);
    const marker = cameraPoint([bus.x, bus.y, 4.8]);
    ctx.beginPath(); ctx.arc(marker.x, marker.y, 13 + Math.sin(now / 300) * 1.5, 0, Math.PI * 2);
    ctx.strokeStyle = '#a3edac'; ctx.lineWidth = 2; ctx.stroke();
    drawScenarioTag(marker, replacement.enRoute ? 'REPLACEMENT EN ROUTE' : 'COVERING SHIFT', '#286c43');
  }

  function drawReliefCandidate(route, progress, now) {
    const bus = busAt(route, progress);
    const point = cameraPoint([bus.x, bus.y, 4.8]);
    const failure = state.disruption;
    const target = cameraPoint([failure.failurePoint.x, failure.failurePoint.y, 2]);
    const distance = formatApproxDistance(Math.hypot(bus.x - failure.failurePoint.x, bus.y - failure.failurePoint.y));
    ctx.save();
    ctx.setLineDash([5, 4]); ctx.strokeStyle = 'rgba(111,226,171,.72)'; ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.moveTo(point.x, point.y); ctx.lineTo(target.x, target.y); ctx.stroke(); ctx.setLineDash([]);
    ctx.beginPath(); ctx.arc(point.x, point.y, 13 + Math.sin(now / 260) * 2, 0, Math.PI * 2);
    ctx.strokeStyle = '#72e0a8'; ctx.lineWidth = 2.2; ctx.stroke();
    const angle = Math.atan2(target.y - point.y, target.x - point.x);
    ctx.fillStyle = '#72e0a8'; ctx.beginPath();
    ctx.moveTo(target.x, target.y); ctx.lineTo(target.x - Math.cos(angle - .45) * 8, target.y - Math.sin(angle - .45) * 8); ctx.lineTo(target.x - Math.cos(angle + .45) * 8, target.y - Math.sin(angle + .45) * 8); ctx.closePath(); ctx.fill();
    drawScenarioTag(point, `NEAREST BUS · ${route.service}`, '#236d50');
    const midpoint = { x: (point.x + target.x) / 2, y: (point.y + target.y) / 2 - 7 };
    ctx.font = '700 8px -apple-system, BlinkMacSystemFont, sans-serif';
    const width = ctx.measureText(distance).width + 10;
    ctx.fillStyle = 'rgba(7,27,23,.9)'; ctx.fillRect(midpoint.x - width / 2, midpoint.y - 6, width, 13);
    ctx.strokeStyle = '#72e0a8'; ctx.lineWidth = 0.7; ctx.strokeRect(midpoint.x - width / 2, midpoint.y - 6, width, 13);
    ctx.fillStyle = '#d8ffeb'; ctx.textAlign = 'center'; ctx.fillText(distance, midpoint.x, midpoint.y + 3); ctx.textAlign = 'start';
    ctx.restore();
  }

  function updateReliefOptions() {
    const container = $('route-relief-options');
    if (!container) return;
    container.replaceChildren();
    if (!state.disruption) { container.hidden = true; return; }
    container.hidden = false;
    const reliefRoutes = state.routes.filter((route) => route.routeId !== state.disruption.routeId);
    const title = document.createElement('b'); title.textContent = 'Nearest buses on selected routes'; container.append(title);
    if (!reliefRoutes.length) {
      const message = document.createElement('span'); message.textContent = 'Select more routes to show the nearest buses.'; container.append(message);
    } else {
      reliefRoutes.forEach((route) => {
        const option = document.createElement('span'); option.className = 'relief-option';
        option.dataset.routeId = route.routeId;
        option.textContent = `Service ${route.service} · nearest bus`;
        container.append(option);
      });
    }
    const note = document.createElement('small'); note.textContent = 'Distance is approximate straight-line map distance, not road distance or dispatch time. Vehicle, crew, and dispatch availability is not verified.'; container.append(note);
  }

  function updateFleetStatus() {
    const failure = state.disruption;
    const returned = failure ? outageReturn(failure).complete : false;
    const values = {
      'fleet-spare-count': failure ? 2 : 3,
      'fleet-broken-count': failure && !returned ? 1 : 0,
      'fleet-maintenance-count': returned ? 6 : 5,
      'fleet-deployed-count': failure ? 1 : 0,
    };
    Object.entries(values).forEach(([id, value]) => {
      const element = $(id); const text = String(value);
      if (element && element.textContent !== text) element.textContent = text;
    });
  }

  function updateReliefDistances() {
    const container = $('route-relief-options');
    if (!container || !state.disruption) return;
    [...container.querySelectorAll('.relief-option')].forEach((option) => {
      const routeIndex = state.routes.findIndex((route) => route.routeId === option.dataset.routeId);
      if (routeIndex < 0) return;
      const route = state.routes[routeIndex];
      const progress = (state.progress + routeIndex * 0.13) % 1;
      const bus = busAt(route, progress);
      const distance = formatApproxDistance(Math.hypot(bus.x - state.disruption.failurePoint.x, bus.y - state.disruption.failurePoint.y));
      option.textContent = `Service ${route.service} · nearest bus · ${distance} away`;
    });
  }

  function updatePassengerCounts() {
    const panel = $('passenger-counts');
    if (!panel) return;
    const routeKey = state.routes.map((route) => route.routeId).join('|');
    if (panel.dataset.routeKey !== routeKey) {
      panel.replaceChildren();
      state.routes.forEach((route) => {
        const row = document.createElement('div'); row.className = 'passenger-count-row'; row.dataset.routeId = route.routeId;
        const heading = document.createElement('div');
        const service = document.createElement('b'); service.textContent = `Service ${route.service}`;
        const count = document.createElement('strong'); count.className = 'passenger-count-value'; count.textContent = '0';
        heading.append(service, count);
        const stopLabel = document.createElement('small'); stopLabel.className = 'passenger-current-stop'; stopLabel.textContent = 'At terminal · 0';
        const meter = document.createElement('div'); meter.className = 'passenger-load-meter';
        const fill = document.createElement('i'); meter.append(fill);
        row.append(heading, stopLabel, meter); panel.append(row);
      });
      panel.dataset.routeKey = routeKey;
    }
    state.routes.forEach((route, index) => {
      const progress = (state.progress + index * 0.13) % 1;
      const stops = route.worldStops;
      const row = [...panel.children].find((item) => item.dataset.routeId === route.routeId);
      if (!row || !stops.length) return;
      const busProgress = state.disruption && route.routeId === state.disruption.routeId ? outageReturn(state.disruption).progress : progress;
      const stopIndex = Math.min(stops.length - 1, Math.floor(busProgress * (stops.length - 1) + 1e-7));
      const atTerminal = progress < 0.006 || stopIndex === 0 || stopIndex === stops.length - 1;
      const stop = stops[stopIndex];
      const info = (state.overlaysByRoute[route.routeId] || {})[stop.order] || {};
      const passengers = atTerminal ? 0 : Math.round(Number(info.avgOnboard || 0));
      row.querySelector('.passenger-count-value').textContent = passengers.toLocaleString();
      row.querySelector('.passenger-current-stop').textContent = atTerminal ? `Stop ${stop.seq} · ${stop.name} · terminal` : `Stop ${stop.seq} · ${stop.name}`;
      row.querySelector('.passenger-load-meter i').style.width = `${Math.min(100, Number(info.avgLoadRatio || 0) * 100)}%`;
    });
  }

  function draw() {
    const rect = canvas.getBoundingClientRect();
    if (!rect.width || !rect.height) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = Math.round(rect.width * dpr), h = Math.round(rect.height * dpr);
    if (canvas.width !== w || canvas.height !== h) { canvas.width = w; canvas.height = h; }
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, rect.width, rect.height);
    drawGround();
    state.routes.forEach((route) => drawRoute(route, route.routeId === state.routeId));
    drawStops(performance.now());
    const busColors = ['#78e0b4','#f2bd66','#83b9f0','#e98a75','#c29bea','#8bd5d0','#d4dd73'];
    const now = performance.now();
    state.routes.forEach((route, index) => {
      const progress = (state.progress + index * .13) % 1;
      if (state.disruption && route.routeId === state.disruption.routeId) {
        const returned = outageReturn(state.disruption, now);
        drawBus(route, returned.progress, returned.complete ? .55 : .88, '#e76b5e', state.disruption.endIndex === 0 && !returned.complete);
      } else {
        drawBus(route, progress, 1, busColors[index % busColors.length]);
        if (state.disruption) drawReliefCandidate(route, progress, now);
      }
    });
    updatePassengerCounts();
    updateReliefDistances();
    updateFleetStatus();
    drawTransferBus(); drawReplacementBus(now); drawBreakdown(now);
    const percent = Math.round(state.progress * 100);
    $('bus-progress-value').textContent = `${['06:30','07:00','07:30','08:00','08:30','09:00'][Math.min(5,Math.floor(percent / 20))]} · ${percent}%`;
    const status = $('route-3d-status');
    if (status) {
      if (state.disruption) {
        const route = state.routes.find((item) => item.routeId === state.disruption.routeId);
        const returned = outageReturn(state.disruption, now);
        const endpoint = route && route.worldStops[state.disruption.endIndex];
        const nearestCount = Math.max(0, state.routes.length - 1);
        status.textContent = `Service ${route?.service || ''} bus ${returned.complete ? 'out of service at' : 'returning to'} ${endpoint?.name || 'interchange'} · ${nearestCount} nearest bus${nearestCount === 1 ? '' : 'es'} identified`;
      } else status.textContent = `${state.routes.length} route${state.routes.length === 1 ? '' : 's'} · ${state.routes.length} moving bus${state.routes.length === 1 ? '' : 'es'}`;
    }
  }

  function selectStop(index, routeId = state.routeId) {
    state.selectedStop = index;
    state.detailRouteId = routeId;
    const route = state.routes.find((item) => item.routeId === routeId);
    const stop = route && route.worldStops[index];
    if (stop) {
      const info = (state.overlaysByRoute[routeId] || {})[stop.order] || {};
      const boards = `${Number(info.boardings || 0).toLocaleString()} observed boardings on ${state.date}`;
      const queue = `${Number(info.avgQueueBefore || 0).toFixed(1)} average people waiting before the bus · ${Number(info.avgQueueAfter || 0).toFixed(1)} after boarding`;
      const late = Number(info.priorCalls) ? `${info.lateCalls}/${info.priorCalls} earlier calls ≥1 min late (${Math.round(info.lateShare * 100)}%)` : 'No earlier calls in sample';
      const cases = state.showReports ? reportedCases.filter((item) => item.stopCode === stop.code && (!item.routeId || item.routeId === routeId)) : [];
      const reports = cases.length ? ` · Passenger reports: ${cases.map((item) => `${item.id} (${item.issue}, ${item.date})`).join('; ')}` : '';
      const detail = `${stop.code} · ${boards} · ${queue} · ${late}${reports}`;
      setMessage(`Service ${route.service} · Stop ${stop.seq} · ${stop.name}`, detail);
      const card = $('route-stop-detail');
      if (card) {
        card.replaceChildren();
        const heading = document.createElement('b'); heading.textContent = `Service ${route.service} · Stop ${stop.seq} · ${stop.name}`;
        const usage = document.createElement('span'); usage.textContent = `${stop.code} · ${Number(info.boardings || 0).toLocaleString()} observed boardings · ${state.date}`;
        const queueDetail = document.createElement('span'); queueDetail.textContent = `Average queue: ${Number(info.avgQueueBefore || 0).toFixed(1)} before bus arrival, ${Number(info.avgQueueAfter || 0).toFixed(1)} after boarding`;
        const reliability = document.createElement('span'); reliability.textContent = `Prior late calls: ${info.priorCalls ? `${info.lateCalls} of ${info.priorCalls} (≥1 minute)` : 'No earlier sample'} · Mean departure load: ${Math.round(Number(info.avgLoadRatio || 0) * 100)}% of stated vehicle capacity`;
        card.append(heading, usage, queueDetail, reliability);
        if (cases.length) {
          const reports = document.createElement('span');
          reports.textContent = `Selected passenger reports: ${cases.map((item) => `${item.id} — ${item.issue} (${item.date})`).join('; ')}. These are reported accounts, not verified breakdown causes.`;
          card.append(reports);
        }
      }
    }
    draw();
  }

  function setDate(date) {
    state.date = date;
    const daily = (overlayData && overlayData.byDate) || {};
    state.overlaysByRoute = {};
    state.routeIds.forEach((routeId) => {
      const routeDay = (daily[date] && daily[date][routeId]) || {};
      const prior = {};
      Object.keys(daily).filter((day) => day < date).forEach((day) => {
        const calls = (daily[day] && daily[day][routeId]) || {};
        Object.entries(calls).forEach(([order, row]) => {
          const total = prior[order] || { priorCalls: 0, lateCalls: 0 };
          total.priorCalls += Number(row.calls || 0); total.lateCalls += Number(row.late60 || 0); prior[order] = total;
        });
      });
      const values = {};
      new Set([...Object.keys(routeDay), ...Object.keys(prior)]).forEach((order) => {
        const p = prior[order] || { priorCalls: 0, lateCalls: 0 };
        values[order] = { ...(routeDay[order] || {}), ...p, lateShare: p.priorCalls ? p.lateCalls / p.priorCalls : 0 };
      });
      state.overlaysByRoute[routeId] = values;
    });
    state.overlays = state.overlaysByRoute[state.routeId] || {};
    const routeDay = (daily[date] && daily[date][state.routeId]) || {};
    const prior = Object.values(state.overlays).reduce((aggregate, row) => ({ priorCalls: aggregate.priorCalls + Number(row.priorCalls || 0), lateCalls: aggregate.lateCalls + Number(row.lateCalls || 0) }), { priorCalls: 0, lateCalls: 0 });
    const totalBoardings = Object.values(routeDay).reduce((sum, row) => sum + Number(row.boardings || 0), 0);
    const summary = $('overlay-summary');
    if (summary) summary.textContent = `${totalBoardings.toLocaleString()} boardings · prior late calls ${prior.lateCalls.toLocaleString()} / ${prior.priorCalls.toLocaleString()}${prior.priorCalls ? ` (${Math.round(prior.lateCalls / prior.priorCalls * 100)}%)` : ' · no earlier dates'}`;
    selectStop(state.selectedStop);
  }

  function setRoute(routeId) {
    if (!data.routes[routeId]) return;
    const oldPrimary = state.routeId;
    state.routeId = routeId;
    if (!state.routeIds.includes(routeId)) state.routeIds = [routeId, ...state.routeIds.filter((id) => id !== oldPrimary)];
    rebuildRoutes();
    $('route-disruption-toggle').checked = Boolean(state.disruption);
    state.selectedStop = 0;
    setPlaying(true);
    if ($('overlay-late')) state.showLate = $('overlay-late').checked;
    if ($('overlay-crowd')) state.showCrowd = $('overlay-crowd').checked;
    if ($('overlay-reports')) state.showReports = $('overlay-reports').checked;
    setDate(state.date);
    selectStop(0);
    draw();
  }

  function setDonor(routeId) {
    if (!routeId || !data.routes[routeId] || routeId === state.routeId || state.donorId === routeId) return;
    const oldDonor = state.donorId;
    state.donorId = routeId;
    if (!state.routeIds.includes(routeId)) state.routeIds = [...state.routeIds.filter((id) => id !== oldDonor), routeId];
    rebuildRoutes(); setDate(state.date); draw();
  }

  function rebuildRoutes() {
    state.routeIds = [...new Set(state.routeIds.filter((id) => data.routes[id]))];
    if (!state.routeIds.length && state.routeId) state.routeIds = [state.routeId];
    if (state.disruption && !state.routeIds.includes(state.disruption.routeId)) {
      state.disruption = null;
      $('route-disruption-toggle').checked = false;
    }
    if (!state.routeIds.includes(state.routeId)) state.routeId = state.routeIds[0];
    state.donorId = state.routeIds.find((id) => id !== state.routeId) || null;
    state.routes = state.routeIds.map((id) => prepareRoute(id)).filter(Boolean);
    state.route = state.routes.find((route) => route.routeId === state.routeId) || state.routes[0] || null;
    state.donorRoute = state.routes.find((route) => route.routeId === state.donorId) || null;
    const counts = $('passenger-counts');
    if (counts) counts.dataset.routeKey = '';
    if (state.route && $('route-scene-label')) $('route-scene-label').textContent = state.routes.map((route) => `Service ${route.service}`).join('  ·  ');
    updateReliefOptions(); updateFleetStatus();
  }

  function setRoutes(routeIds) {
    const selected = [...new Set((routeIds || []).filter((id) => data.routes[id]))];
    if (!selected.length) return;
    state.routeIds = selected;
    if (!selected.includes(state.routeId)) state.routeId = selected[0];
    state.routeIds = [state.routeId, ...selected.filter((id) => id !== state.routeId)];
    if (state.disruption && !selected.includes(state.disruption.routeId)) state.disruption = null;
    $('route-disruption-toggle').checked = Boolean(state.disruption);
    rebuildRoutes(); setDate(state.date); updateReliefOptions(); draw();
  }

  function setProgress(progress) { state.progress = Math.max(0, Math.min(1, Number(progress))); slider.value = String(Math.round(state.progress * 100)); draw(); }
  function getRoutes() { return [...state.routeIds]; }
  function setAllocation(buses, headway) { state.allocationBuses = Math.max(0, Number(buses) || 0); state.headway = Math.max(1, Number(headway) || 12); draw(); }
  function setPlaying(playing) { state.playing = Boolean(playing); $('bus-play-toggle').textContent = state.playing ? 'Ⅱ Pause buses' : '▶ Resume buses'; $('bus-play-toggle').setAttribute('aria-pressed', String(state.playing)); }

  canvas.addEventListener('pointerdown', (event) => {
    state.dragging = true; state.moved = false; state.last = [event.clientX, event.clientY];
    canvas.setPointerCapture(event.pointerId);
  });
  canvas.addEventListener('pointermove', (event) => {
    if (!state.dragging || !state.last) return;
    const dx = event.clientX - state.last[0], dy = event.clientY - state.last[1];
    if (Math.abs(dx) + Math.abs(dy) > 2) state.moved = true;
    state.yaw += dx * 0.008;
    state.pitch = Math.max(0.22, Math.min(1.25, state.pitch + dy * 0.006));
    state.last = [event.clientX, event.clientY]; draw();
  });
  canvas.addEventListener('pointerup', (event) => {
    if (!state.moved) {
      const rect = canvas.getBoundingClientRect();
      const x = event.clientX - rect.left, y = event.clientY - rect.top;
      const nearest = state.hits.map((hit) => ({ ...hit, d: Math.hypot(hit.x - x, hit.y - y) })).sort((a, b) => a.d - b.d)[0];
      if (nearest && nearest.d < Math.max(18, nearest.radius + 8)) selectStop(nearest.index, nearest.routeId);
    }
    state.dragging = false; state.last = null;
  });
  canvas.addEventListener('pointercancel', () => { state.dragging = false; state.last = null; });
  canvas.addEventListener('wheel', (event) => {
    event.preventDefault(); state.zoom = Math.max(0.3, Math.min(4, state.zoom * (event.deltaY < 0 ? 1.08 : 0.92))); draw();
  }, { passive: false });
  slider.addEventListener('input', () => { state.progress = Number(slider.value) / 100; draw(); window.dispatchEvent(new CustomEvent('lionlink-route-time', { detail: { progress: state.progress } })); });
  $('bus-play-toggle').addEventListener('click', () => {
    setPlaying(!state.playing);
  });
  $('route-view-reset').addEventListener('click', () => { state.yaw = -0.48; state.pitch = 0.82; state.zoom = 1; draw(); });
  $('overlay-late').addEventListener('change', (event) => { state.showLate = event.target.checked; selectStop(state.selectedStop); });
  $('overlay-crowd').addEventListener('change', (event) => { state.showCrowd = event.target.checked; draw(); });
  $('overlay-reports').addEventListener('change', (event) => { state.showReports = event.target.checked; draw(); });
  $('route-replay-mode').addEventListener('change', (event) => { state.replayMode = event.target.value; draw(); });
  $('route-disruption-toggle').addEventListener('change', (event) => {
    if (event.target.checked && state.route) {
      const failureProgress = state.progress;
      const bus = busAt(state.route, failureProgress);
      state.disruption = {
        routeId: state.route.routeId,
        failureProgress,
        failurePoint: { x: bus.x, y: bus.y },
        endIndex: failureProgress <= 0.5 ? 0 : state.route.worldStops.length - 1,
        startedAt: performance.now(),
        returnDuration: 6500,
      };
      const distanceFraction = Math.abs(failureProgress - state.disruption.endIndex / (state.route.worldStops.length - 1));
      state.disruption.returnDuration = 30000 * distanceFraction;
      state.disruption.dispatchDuration = state.disruption.returnDuration;
    } else state.disruption = null;
    updateReliefOptions(); updateFleetStatus(); draw();
  });
  new ResizeObserver(draw).observe(canvas);

  let lastFrame = 0, lastTimeBin = -1;
  function animate(now) {
    try {
      if (state.playing && state.route) {
        const elapsed = lastFrame ? Math.min(now - lastFrame, 100) : 0;
        state.progress = (state.progress + elapsed / 30000) % 1;
        slider.value = String(Math.round(state.progress * 100));
        const timeBin = Math.min(5, Math.floor(state.progress * 6));
        if (timeBin !== lastTimeBin) { lastTimeBin = timeBin; window.dispatchEvent(new CustomEvent('lionlink-route-time', { detail: { progress: timeBin / 5 } })); }
        draw();
      }
    } catch (error) {
      console.error('LionLink 3D animation frame failed:', error);
      const status = $('route-3d-status');
      if (status) status.textContent = `3D rendering error: ${error.message}`;
    }
    lastFrame = now;
    requestAnimationFrame(animate);
  }
  requestAnimationFrame(animate);

  window.LionLink3D = { setRoute, setDonor, setRoutes, getRoutes, setDate, setProgress, setAllocation, setPlaying, draw };
  setRoute('B238_1');
})();
