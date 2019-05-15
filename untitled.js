const Tag = require("./Tag.js");
const data = require("./data.json");


class Tags{
  constructor(){
    this.tags = new Map();
    data.forEach((item, index, array) => {
      let newTag = new Tag(item);
      this.tags.set(newTag.id,newTag);
    });
  }
  get size(){
    return this.tags.size;
  }
  addTag(tag){
    let newTag = new Tag(tag);
    console.log("addTag :"+JSON.stringify(newTag));
    this.tags.set(newTag.id,newTag);
    return this.getTag(newTag.id);
  }
  getTag(id){
    this.tags.forEach(logMapElements);
    console.log(typeof id);
    console.log("getting tags with id "+id+" : "+JSON.stringify(this.tags.get(id)));
    return this.tags.get(id);
  }
  deleteTag(id){
    this.tags.forEach(logMapElements);
    let tag = this.tags.get(id);
	console.log("tag :"+JSON.stringify(tag));
    if(undefined!=tag){
      this.tags.delete(id);
      return id;
    } else {
      return undefined;
    }
  }
  updateTag(updatedTag){
    const hasTag = this.tags.has(updatedTag.id);
    if(hasTag){
      this.tags.set(updatedTag.id,updatedTag);
      return updatedTag;
    } else {
      return undefined;
    }
  }
  getTags(){
    let tabTags = [];
    for (const v of this.tags.values()) {
      tabTags.push(v);
    }
    return tabTags;
  }
  deleteTags(){
    this.tags.clear();
  }

}

function logMapElements(value, key, map) {
  console.log("m["+key+"] = "+JSON.stringify(value));
}


module.exports = Tags;