"""Original LionLink concept bus. Run with Blender --background --python build_bus.py."""
import bpy, math, os, json
from mathutils import Vector
from collections import defaultdict
OUT=os.path.dirname(os.path.abspath(__file__))
bpy.ops.wm.read_factory_settings(use_empty=True)
scene=bpy.context.scene
scene.name='LionLink • Studio'
model=bpy.data.collections.new('LionLink • Editable bus'); scene.collection.children.link(model)
studio=bpy.data.collections.new('Studio • Not exported'); scene.collection.children.link(studio)

def lin(c): return c/12.92 if c<.04045 else ((c+.055)/1.055)**2.4
def mat(name,h,metal=0,rough=.4,emission=0):
 m=bpy.data.materials.new(name); m.use_nodes=True
 rgb=tuple(lin(int(h[i:i+2],16)/255) for i in (0,2,4))
 p=m.node_tree.nodes.get('Principled BSDF'); p.inputs['Base Color'].default_value=(*rgb,1); p.inputs['Metallic'].default_value=metal; p.inputs['Roughness'].default_value=rough
 if emission: p.inputs['Emission Color'].default_value=(*rgb,1); p.inputs['Emission Strength'].default_value=emission
 m.diffuse_color=(*rgb,1); return m
cream=mat('01 • Warm ivory | F6F5ED','F6F5ED',.08,.32)
green=mat('02 • LionLink forest | 195744','195744',.15,.3)
sage=mat('03 • Sage | 88A88A','88A88A',.05,.4)
lime=mat('04 • Soft lime | D6EAA6','D6EAA6',.05,.36)
dark=mat('05 • Deep forest trim','153D32',.1,.33)
glass=mat('06 • Smoked green glazing','294C49',.38,.18)
reflect=mat('07 • Glazing reflections','577570',.3,.23)
rubber=mat('08 • Tire rubber','202A27',0,.78)
metal=mat('09 • Satin alloy','C1CDC4',.75,.25)
black=mat('10 • Recesses','111E19',0,.58)
led=mat('11 • Destination LEDs','DEEEB1',0,.3,1)
white=mat('12 • Headlamp LED','F8FFE9',.1,.2,2)
red=mat('13 • Tail lamps','C5473B',.15,.3,.4)
amber=mat('14 • Amber indicators','F0BC67',.1,.3,.5)

def link(obj,coll=model):
 for c in list(obj.users_collection): c.objects.unlink(obj)
 coll.objects.link(obj)
 return obj

def finish(obj,name,material,bevel=0):
 obj.name=name; link(obj)
 obj.data.materials.append(material)
 if bevel:
  mod=obj.modifiers.new('Soft manufactured edges','BEVEL'); mod.width=bevel; mod.segments=3
  bpy.context.view_layer.objects.active=obj; bpy.ops.object.modifier_apply(modifier=mod.name)
 for p in obj.data.polygons: p.use_smooth=True
 mod=obj.modifiers.new('Weighted corner normals','WEIGHTED_NORMAL'); mod.keep_sharp=True; mod.weight=50
 return obj

def box(name,loc,size,material,bevel=.025):
 bpy.ops.mesh.primitive_cube_add(size=1,location=loc); o=bpy.context.object; o.dimensions=size
 bpy.ops.object.transform_apply(location=False,rotation=False,scale=True)
 return finish(o,name,material,bevel)

def cyl(name,loc,r,depth,material,axis='Y',vertices=48):
 bpy.ops.mesh.primitive_cylinder_add(vertices=vertices,radius=r,depth=depth,location=loc)
 o=bpy.context.object
 if axis=='Y': o.rotation_euler[0]=math.pi/2
 if axis=='X': o.rotation_euler[1]=math.pi/2
 return finish(o,name,material,.009)

def rod(name,a,b,r,material):
 d=Vector(b)-Vector(a); o=cyl(name,(Vector(a)+Vector(b))/2,r,d.length,material,'Z',12); o.rotation_euler=d.to_track_quat('Z','Y').to_euler(); return o

def mesh(name,verts,faces,material):
 data=bpy.data.meshes.new(name); data.from_pydata(verts,[],faces); data.update(); o=bpy.data.objects.new(name,data); model.objects.link(o); o.data.materials.append(material); return o

# Override font paths when rebuilding on another platform. Saved .blend files
# already include packed fonts. Fall back to Blender Bfont when unavailable.
def load_font(env_key, default_path):
 path=os.environ.get(env_key, default_path)
 return bpy.data.fonts.load(path) if os.path.isfile(path) else bpy.data.fonts.get('Bfont')
font=load_font('LIONLINK_FONT_BOLD','/System/Library/Fonts/Supplemental/Arial Bold.ttf')
font_regular=load_font('LIONLINK_FONT_REGULAR','/System/Library/Fonts/Supplemental/Arial.ttf')
def text(name,body,loc,size,material,face='left',regular=False,maxwidth=None):
 cu=bpy.data.curves.new(name,'FONT'); cu.body=body; cu.font=font_regular if regular else font; cu.size=size; cu.align_x='CENTER'; cu.align_y='CENTER'; cu.extrude=.0008; cu.resolution_u=5
 o=bpy.data.objects.new(name,cu); model.objects.link(o); o.location=loc
 o.rotation_euler={'left':(math.pi/2,0,0),'right':(math.pi/2,0,math.pi),'front':(math.pi/2,0,-math.pi/2),'rear':(math.pi/2,0,math.pi/2)}[face]
 cu.materials.append(material); bpy.context.view_layer.update()
 if maxwidth:
  width=o.dimensions.x if face in ('left','right') else o.dimensions.y
  if width>maxwidth: o.scale.x*=maxwidth/width
 return o

# 12 m long, 2.55 m wide, 4.35 m tall: Singapore-style tri-axle double-decker.
body=box('Lower body • wheel arch cutouts',(0,0,.88),(12,2.5,1.05),cream,.13)
for x in (-3.45,3.15,4.65):
 cutter=cyl('Temporary wheel opening',(x,0,.63),.705,3,black)
 bpy.context.view_layer.objects.active=body
 mod=body.modifiers.new('Wheel well','BOOLEAN'); mod.operation='DIFFERENCE'; mod.object=cutter
 bpy.ops.object.modifier_apply(modifier=mod.name); bpy.data.objects.remove(cutter,do_unlink=True)
box('Undercarriage',(0,0,.44),(11.65,1.85,.25),black,.06)
box('Passenger cabin',(0,0,2.79),(11.92,2.46,2.86),cream,.13)
box('Roof cap',(0,0,4.255),(11.75,2.46,.18),green,.09)
box('Rooftop air conditioning',(2.75,0,4.39),(3.1,1.52,.22),cream,.1)
for x in [1.55+i*.17 for i in range(15)]: box('HVAC vent',(x,0,4.507),(.045,1.08,.012),sage,.008)
# Continuous waist and skirt accent lines.
for side in (-1,1):
 y=side*1.254
 box('Forest waist ribbon',(0,y,2.74),(11.65,.035,.42),green,.025)
 box('Lime pinstripe',(0,y,2.965),(11.65,.045,.035),lime,.008)
 # Rear green service panel; real arch openings remain exposed.
 box('Rear corner livery',(5.67,y,1.04),(.46,.04,.63),green,.03)
 for a,b in [(-5.88,-4.2),(-2.7,2.4),(5.4,5.88)]:
  box('Lower forest skirt',((a+b)/2,y,.53),(b-a,.034,.21),green,.025)
 # Upper glazing: dark gaskets and individual panes.
 for i in range(8):
  x=-5.13+i*1.46
  box('Upper window rubber surround',(x,side*1.244,3.555),(1.43,.052,1.13),dark,.055)
  box('Upper smoked window',(x,side*1.277,3.555),(1.32,.018,1.015),glass,.046)
  # Narrow reflected bands give a designed, readable glass surface.
  verts=[(x-.56,side*1.289,3.12),(x-.40,side*1.289,3.12),(x+.12,side*1.289,3.99),(x-.04,side*1.289,3.99)]
  o=mesh('Upper window soft reflection',verts,[(0,1,2,3)],reflect)
  box('Upper window lower rail',(x,side*1.294,3.095),(1.29,.012,.022),sage,.004)
 # Lower glazing segmented around the curb-side doors.
 spans=[(-4.48,-2.55),(-2.44,-.18),(1.63,3.55),(3.67,5.7)] if side==-1 else [(-5.7,-4.47),(-4.35,-2.48),(-2.36,-.48),(-.36,1.52),(1.64,3.53),(3.65,5.7)]
 for a,b in spans:
  x=(a+b)/2; w=b-a
  box('Lower window gasket',(x,side*1.253,2.0),(w,.055,1.10),dark,.035)
  box('Lower glazing',(x,side*1.286,2.0),(w-.085,.02,.99),glass,.025)
  box('Sliding window divider',(x,side*1.301,2.17),(w-.09,.024,.025),dark,.003)
  box('Sliding window vertical',(x+.22,side*1.30,2.34),(.021,.02,.31),dark,.002)
  mesh('Lower glass reflection',[(a+.12,side*1.3,1.58),(a+.26,side*1.3,1.58),(a+.68,side*1.3,2.45),(a+.54,side*1.3,2.45)],[(0,1,2,3)],reflect)
 face='left' if side==-1 else 'right'
 text('LionLink side wordmark','LionLink',(-.3,side*1.281,2.75),.34,cream,face)
 text('Side fleet number','LL • 001',(5.40,side*1.278,2.75),.11,lime,face)
 text('Community tagline','CONNECTING OUR CITY',(-1.4,side*1.278,1.12),.105,green,face,True,maxwidth=1.9)
 # Sage / lime route motif, placed on lower side sheet metal.
 for j in range(3):
  a=-2.53+j*.2; b=-1.6+j*.2
  mesh('Route livery slash',[(a,side*1.279,.69),(a+.12,side*1.279,.69),(b,side*1.279,1.36),(b-.12,side*1.279,1.36)],[(0,1,2,3)],sage if j!=1 else lime)
 for x in (-2.3,2.2,5.6): box('Side amber marker',(x,side*1.285,.72),(.12,.028,.055),amber,.015)
 # Engine service louvers near rear, below lower window.
 for j in range(7): box('Engine ventilation slit',(5.45,side*1.282,.95+j*.057),(.62,.02,.019),dark,.005)

# Curb-side split passenger doors.
for x,w,label in [(-5.15,1.25,'ENTRY'),(.72,1.57,'EXIT')]:
 box(label+' door recess',(x,-1.271,1.45),(w,.075,2.1),black,.045)
 for dx in (-w/4,w/4):
  box(label+' door leaf',(x+dx,-1.318,1.48),(w/2-.04,.023,2.0),dark,.019)
  box(label+' door glass',(x+dx,-1.335,1.63),(w/2-.12,.014,1.65),glass,.02)
  rod('Door safety grab bar',(x+dx-.09,-1.349,.95),(x+dx+.09,-1.349,1.55),.013,lime)
 box('Door centre seal',(x,-1.35,1.45),(.038,.027,2.0),black,.004)
 box('Door step edge',(x,-1.36,.435),(w-.10,.09,.032),lime,.007)
 text('Door marking',label,(x,-1.36,2.43),.08,cream,'left')
text('Accessibility marking','PRIORITY',(.72,-1.366,.69),.075,lime)
# A small side destination display in the lower window.
box('Side destination housing',(-1.45,-1.32,2.35),(1.75,.035,.27),black,.014)
text('Side destination','101  LIONLINK',(-1.45,-1.345,2.35),.14,led)

# Front face: two-storey glazing, destination blind, styled fascia.
box('Front upper glazing gasket',(-5.968,0,3.59),(.06,2.32,1.2),dark,.11)
box('Front panoramic upper glass',(-6.008,0,3.59),(.025,2.20,1.09),glass,.09)
box('Front upper lower rail',(-6.028,0,3.16),(.018,2.12,.034),sage,.012)
box('Front destination fascia',(-6.005,0,2.91),(.07,2.33,.49),black,.045)
text('Front destination text','LIONLINK',(-6.049,.35,2.92),.237,led,'front',maxwidth=1.42)
text('Front route number','101',(-6.05,-.83,2.92),.28,led,'front')
box('Front windshield gasket',(-5.979,0,1.97),(.065,2.33,1.45),dark,.105)
box('Front windshield',(-6.021,0,1.99),(.027,2.20,1.31),glass,.088)
# Pane reflection strokes, directly on front glazing.
for z in (1.48,3.18):
 mesh('Front reflection',[(-6.04,.30,z),(-6.04,.55,z),(-6.04,1.01,z+.87),(-6.04,.8,z+.87)],[(0,1,2,3)],reflect)
box('Front windshield centre rail',(-6.043,0,1.98),(.02,.032,1.28),dark,.009)
for y in (-.59,.59):
 rod('Wiper arm',(-6.075,y-.16,1.39),(-6.075,y+.09,1.74),.012,black)
 rod('Wiper blade',(-6.08,y-.12,1.66),(-6.08,y+.43,1.66),.017,black)
box('Forest front fascia',(-5.99,0,.92),(.08,2.31,.53),green,.08)
box('Front lower bumper',(-5.985,0,.45),(.10,2.3,.18),green,.055)
box('Front lime signature',(-6.045,0,1.207),(.016,2.14,.038),lime,.015)
text('Front LionLink badge','LionLink',(-6.045,0,.99),.185,cream,'front')
for side in (-1,1):
 y=side*.91
 box('Headlamp dark housing',(-6.053,y,.84),(.035,.41,.21),dark,.06)
 box('Headlamp light strip',(-6.077,y,.87),(.02,.32,.058),white,.018)
 box('Headlamp lower light',(-6.078,y,.80),(.02,.22,.024),white,.009)
 box('Front turn signal',(-6.066,side*1.1,.66),(.024,.12,.051),amber,.018)
 cyl('Fog lamp',(-6.06,side*.83,.47),.047,.026,white,'X',24)
 # Mirror supports extending out from the A pillars.
 rod('Mirror upper stalk',(-5.73,side*1.18,2.67),(-6.16,side*1.52,2.66),.035,dark)
 rod('Mirror drop arm',(-6.16,side*1.52,2.66),(-6.18,side*1.53,2.35),.027,dark)
 box('Mirror housing',(-6.18,side*1.53,2.28),(.23,.17,.43),green,.073)
 box('Mirror reflective face',(-6.049,side*1.53,2.28),(.015,.12,.32),metal,.035)
box('Front plate',(-6.061,0,.53),(.025,.52,.115),cream,.01)
text('Front registration','LL 001',(-6.08,0,.53),.087,dark,'front')
# Rear glazing, service hatch, vents, lamps, and identity.
box('Rear upper gasket',(5.973,0,3.57),(.055,2.18,1.05),dark,.08)
box('Rear upper window',(6.01,0,3.57),(.022,2.04,.91),glass,.065)
box('Rear lower service hatch',(5.99,0,1.47),(.06,2.14,1.9),green,.06)
text('Rear LionLink wordmark','LionLink',(6.037,0,2.3),.29,cream,'rear')
text('Rear tagline','A CITY. CONNECTED.',(6.038,0,2.03),.102,lime,'rear')
for j in range(12): box('Rear engine grille',(6.032,0,1.0+j*.051),(.025,1.40,.024),dark,.005)
for y in (-1.01,1.01):
 box('Rear lamp cluster',(6.04,y,1.15),(.05,.12,.76),black,.036)
 for z,ma in [(1.40,red),(1.19,red),(.99,amber),(.80,white)]: box('Rear light',(6.073,y,z),(.018,.073,.11),ma,.025)
box('Rear bumper',(6.0,0,.45),(.11,2.3,.17),dark,.05)
box('Rear number plate',(6.058,0,.65),(.025,.55,.115),lime,.01)
text('Rear registration','LL 001',(6.08,0,.65),.087,dark,'rear')
box('Rear route display',(6.018,-.74,2.78),(.025,.59,.30),black,.022)
text('Rear route number','101',(6.04,-.74,2.78),.22,led,'rear')

# Six wheels; modeled tire shoulders, alloy rings, hubs, lug nuts.
for axle,x in enumerate((-3.45,3.15,4.65)):
 for side in (-1,1):
  tag=f'Wheel {axle+1} '+('L' if side==-1 else 'R')
  y=side*1.11; z=.605
  cyl(tag+' tire',(x,y,z),.598,.32,rubber)
  cyl(tag+' sidewall',(x,side*1.277,z),.532,.019,rubber)
  cyl(tag+' alloy rim',(x,side*1.297,z),.385,.032,metal)
  cyl(tag+' dark dish',(x,side*1.317,z),.323,.016,dark)
  cyl(tag+' hub',(x,side*1.34,z),.21,.055,metal)
  cyl(tag+' green centre',(x,side*1.375,z),.132,.03,green)
  for i in range(10):
   a=i*math.tau/10
   cyl(tag+' rim aperture',(x+math.sin(a)*.286,side*1.33,z+math.cos(a)*.286),.046,.009,black,vertices=16)
   cyl(tag+' lug nut',(x+math.sin(a)*.169,side*1.38,z+math.cos(a)*.169),.024,.025,metal,vertices=6)
  # Arch trim follows the upper half of the wheel well.
  for i in range(24):
   a=i*math.pi/24; b=(i+1)*math.pi/24
   rod('Wheel arch edging',(x+.72*math.cos(a),side*1.271,z+.72*math.sin(a)),(x+.72*math.cos(b),side*1.271,z+.72*math.sin(b)),.021,dark)
  box('Mud flap',(x+.65,side*1.07,.40),(.06,.31,.37),rubber,.014)

# Preserve editability: separate named components in the .blend.
root=bpy.data.objects.new('LionLink_Bus',None); model.objects.link(root)
root['brand']='LionLink'; root['units']='metres'; root['vehicle']='Original Singapore-inspired 12m double-decker concept'
for o in list(model.objects):
 if o!=root: o.parent=root

# Studio setup is excluded from the asset export.
floor=box('Studio ground',(0,0,-.055),(200,200,.1),mat('Studio cream','F0F1E7'),.01); link(floor,studio)
def area(name,loc,power,size):
 data=bpy.data.lights.new(name,'AREA'); data.energy=power; data.shape='DISK'; data.size=size
 o=bpy.data.objects.new(name,data); studio.objects.link(o); o.location=loc; o.rotation_euler=(Vector((0,0,1.8))-o.location).to_track_quat('-Z','Y').to_euler()
area('Key softbox',(-6,-7,12),2400,8)
area('Roof softbox',(4,4,11),3000,7)
area('Front fill',(-10,5,5),1400,6)
scene.world=bpy.data.worlds.new('Warm studio'); scene.world.use_nodes=True; scene.world.node_tree.nodes['Background'].inputs[0].default_value=(.65,.72,.65,1); scene.world.node_tree.nodes['Background'].inputs[1].default_value=.45
camdata=bpy.data.cameras.new('Hero camera'); cam=bpy.data.objects.new('Hero camera',camdata); studio.objects.link(cam)
cam.location=(-13,-18,9.3); target=Vector((0,0,2.0)); cam.rotation_euler=(target-cam.location).to_track_quat('-Z','Y').to_euler(); camdata.type='ORTHO'; camdata.ortho_scale=16.8; scene.camera=cam
scene.render.engine='CYCLES'; scene.cycles.samples=32; scene.cycles.use_denoising=True
scene.render.resolution_x=1600; scene.render.resolution_y=1050; scene.render.resolution_percentage=100
scene.view_settings.view_transform='AgX'
scene.render.image_settings.file_format='PNG'; scene.render.filepath=os.path.join(OUT,'lionlink-bus.png')
# A clean material viewport when the saved file opens.
for screen in bpy.data.screens:
 for ar in screen.areas:
  if ar.type=='VIEW_3D':
   ar.spaces.active.region_3d.view_distance=17
   ar.spaces.active.region_3d.view_location=(0,0,2)
   ar.spaces.active.region_3d.view_rotation=cam.rotation_euler.to_quaternion()
   ar.spaces.active.shading.color_type='MATERIAL'
bpy.ops.object.select_all(action='DESELECT'); root.select_set(True); bpy.context.view_layer.objects.active=root
bpy.ops.file.pack_all()
bpy.ops.wm.save_as_mainfile(filepath=os.path.join(OUT,'lionlink-bus.blend'))
# Evaluate and combine copies by material for a compact, low-draw-call GLB.
export_coll=bpy.data.collections.new('Temporary export'); scene.collection.children.link(export_coll)
depsgraph=bpy.context.evaluated_depsgraph_get(); groups=defaultdict(list)
for o in list(model.objects):
 if o.type not in {'MESH','FONT','CURVE'}: continue
 evaluated=o.evaluated_get(depsgraph); me=bpy.data.meshes.new_from_object(evaluated,depsgraph=depsgraph)
 copy=bpy.data.objects.new(o.name,me); export_coll.objects.link(copy); copy.matrix_world=o.matrix_world.copy()
 key=me.materials[0].name if me.materials else 'default'; groups[key].append(copy)
export_root=bpy.data.objects.new('LionLink_Bus',None); export_coll.objects.link(export_root)
triangles=0
for key,objects in groups.items():
 bpy.ops.object.select_all(action='DESELECT')
 for o in objects:o.select_set(True)
 bpy.context.view_layer.objects.active=objects[0]; bpy.ops.object.join(); o=bpy.context.object; o.name=key.split(' • ')[-1]; o.parent=export_root
 o.data.calc_loop_triangles(); triangles+=len(o.data.loop_triangles)
bpy.ops.object.select_all(action='DESELECT')
for o in export_coll.objects:o.select_set(True)
bpy.context.view_layer.objects.active=export_root
bpy.ops.export_scene.gltf(filepath=os.path.join(OUT,'lionlink-bus.glb'),export_format='GLB',use_selection=True,export_yup=True,export_cameras=False,export_lights=False,export_animations=False,export_extras=True)
metrics={'triangles':triangles,'materials':len(groups),'glb_bytes':os.path.getsize(os.path.join(OUT,'lionlink-bus.glb')),'dimensions_metres':{'length':12,'body_width':2.5,'height':4.51},'coordinate_system':'glTF Y up; front faces -X; ground at Y=0','editable_objects':len(model.objects)}
with open(os.path.join(OUT,'asset-info.json'),'w') as f:json.dump(metrics,f,indent=2)
for o in list(export_coll.objects):bpy.data.objects.remove(o,do_unlink=True)
bpy.data.collections.remove(export_coll)
print('ASSET_METRICS',json.dumps(metrics),flush=True)
bpy.ops.render.render(write_still=True)
print('LIONLINK_COMPLETE',flush=True)
