###### [*Go Back*](../help.md)
# ***ALL*** FUNCTIONS OF THE [**API**](ALL.md)
## ***matblox.block***
```typescript
matblox.blocks.setblock(x,y,z,block,data?)
matblox.blocks.set([x1,y1,z1],[x2,y2,z2],block,data?)
matblox.blocks.setdata(x,y,z,data)
matblox.blocks.getblock(x,y,z)
matblox.blocks.getdata(x,y,z)
```
## matblox.mod ***(Very Cool)***
##### [***Images Creator***](https://matwindow.github.io/Matblox/textures/)
```typescript
matblox.mod.item.add("id (name)",{raw .matimg image||existing texture, example: stone_bricks},{damage:10,name:"Name",disc:"Hello World",use:["item","chestplate","helmet","boots","legings","ring","punch"],crafting:[[["id (name)"|null,"id (name)"|null,"id (name)"|null,]
["id (name)"|null,"id (name)"|null,"id (name)"|null],
["id (name)"|null,"id (name)"|null,"id (name)"|null]]]})
matblox.mod.item.delete("id (name)")
matblox.mod.block.add("id (name)",{raw .matimg image||existing texture, example: stone_bricks},{type:"block"|"stair"|"slab"|"glass"|"transperent",slide:false|1,crafting:
[[["id (name)"|null,"id (name)"|null,"id (name)"|null,]
["id (name)"|null,"id (name)"|null,"id (name)"|null],
["id (name)"|null,"id (name)"|null,"id (name)"|null]]]
})
matblox.mod.block.delete("id (name)")
```
