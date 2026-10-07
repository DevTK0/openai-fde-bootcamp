"""Create semantic parts and replaceable sign surfaces from the editable bus."""
import bpy,os,json
from collections import defaultdict
from mathutils import Vector
OUT=os.path.dirname(os.path.abspath(__file__))
bpy.ops.wm.open_mainfile(filepath=os.path.join(OUT,'lionlink-bus.blend'))
scene=bpy.context.scene
model=bpy.data.collections.get('LionLink • Editable bus')
# Dynamic lettering is replaced by UV-mapped sign panels.
remove=['Front route number','Rear route number','Side destination','Side fleet number','Front registration','Rear registration']
for o in list(model.objects):
 if o.type=='FONT' and any(o.name.startswith(n) for n in remove):bpy.data.objects.remove(o,do_unlink=True)

def part(o):
 n=o.name.lower(); x,y,z=o.location
 if n.startswith('display_'):return n
 if n.startswith('wheel ') and o.name.split()[1].isdigit():
  words=o.name.split(); return 'wheel_'+words[1]+'_'+words[2].lower()
 if n.startswith('entry') or n.startswith('exit'):return 'front_door' if n.startswith('entry') else 'centre_door'
 if n.startswith(('door ','accessibility')):return 'front_door' if x<-3 else 'centre_door'
 if 'wiper' in n:return 'wipers'
 if 'mirror' in n:return 'mirrors'
 if any(s in n for s in ['headlamp','fog lamp','front turn signal']):return 'front_lights'
 if any(s in n for s in ['rear lamp','rear light']):return 'rear_lights'
 if any(s in n for s in ['rear lower service','rear engine','engine ventilation']):return 'engine_bay'
 if 'air conditioning' in n or 'hvac' in n:return 'roof_ac'
 if 'windshield' in n:return 'windshield'
 if 'window' in n or 'glazing' in n or 'glass reflection' in n or 'upper glass' in n:return 'windows'
 if 'undercarriage' in n:return 'underbody'
 return 'body'

signs=[
 ('display_service_front',(-6.058,-.83,2.92),.57,.34,(0,-1,0)),
 ('display_service_side',(-1.45,-1.35,2.35),1.69,.225,(1,0,0)),
 ('display_service_rear',(6.049,-.74,2.78),.54,.26,(0,1,0)),
 ('display_fleet_left',(5.4,-1.292,2.75),.72,.14,(1,0,0)),
 ('display_fleet_right',(5.4,1.292,2.75),.72,.14,(-1,0,0)),
 ('display_fleet_front',(-6.086,0,.53),.49,.095,(0,-1,0)),
 ('display_fleet_rear',(6.086,0,.65),.49,.095,(0,1,0))]
for name,center,w,h,right in signs:
 c=Vector(center); u=Vector(right); v=Vector((0,0,1))
 verts=[c-u*w/2-v*h/2,c+u*w/2-v*h/2,c+u*w/2+v*h/2,c-u*w/2+v*h/2]
 me=bpy.data.meshes.new(name);me.from_pydata(verts,[],[(0,1,2,3)]);me.update()
 uv=me.uv_layers.new(name='UVMap')
 for i,coords in enumerate([(0,0),(1,0),(1,1),(0,1)]):uv.data[i].uv=coords
 o=bpy.data.objects.new(name,me);model.objects.link(o)
 m=bpy.data.materials.new(name+'_material');m.use_nodes=True;m.diffuse_color=(.007,.022,.014,1)
 m.node_tree.nodes['Principled BSDF'].inputs['Base Color'].default_value=m.diffuse_color
 me.materials.append(m);o['display_id']=name.removeprefix('display_')
for o in model.objects:
 if o.type in {'MESH','FONT'}:o['part_id']=part(o)
bpy.ops.file.pack_all()
bpy.ops.wm.save_as_mainfile(filepath=os.path.join(OUT,'lionlink-maintenance.blend'))
export=bpy.data.collections.new('Interactive export');scene.collection.children.link(export)
groups=defaultdict(list);depsgraph=bpy.context.evaluated_depsgraph_get()
for o in list(model.objects):
 if o.type not in {'MESH','FONT','CURVE'}:continue
 me=bpy.data.meshes.new_from_object(o.evaluated_get(depsgraph),depsgraph=depsgraph)
 copy=bpy.data.objects.new(o.name,me);export.objects.link(copy);copy.matrix_world=o.matrix_world.copy()
 groups[(part(o),me.materials[0].name)].append(copy)
root=bpy.data.objects.new('LionLink_Interactive',None);export.objects.link(root);root['schema_version']=1
roots={}
for (pid,material),objects in groups.items():
 if pid not in roots:
  group=bpy.data.objects.new(pid,None);export.objects.link(group);group.parent=root;group['part_id']=pid;roots[pid]=group
 bpy.ops.object.select_all(action='DESELECT')
 for o in objects:o.select_set(True)
 bpy.context.view_layer.objects.active=objects[0];bpy.ops.object.join()
 o=bpy.context.object;o.name=pid+'__'+material.split(' • ')[-1];o.parent=roots[pid];o['part_id']=pid
bpy.ops.object.select_all(action='DESELECT')
for o in export.objects:o.select_set(True)
bpy.context.view_layer.objects.active=root
bpy.ops.export_scene.gltf(filepath=os.path.join(OUT,'lionlink-maintenance.glb'),export_format='GLB',use_selection=True,export_extras=True,export_cameras=False,export_lights=False,export_animations=False)
with open(os.path.join(OUT,'interactive-asset-info.json'),'w') as f:json.dump({'component_ids':sorted(roots),'glb_bytes':os.path.getsize(os.path.join(OUT,'lionlink-maintenance.glb')),'coordinate_system':'Y up, metres, front -X; curb side +Z','sign_ids':[s[0] for s in signs]},f,indent=2)
print('INTERACTIVE_EXPORT_COMPLETE')
