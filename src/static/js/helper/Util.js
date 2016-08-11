"use strict";

class Util{
    constructor(){
    }
    static teste(){
      alert('a static method was created');
    }

    /**
	* remove invalid chars that cannot be placed in id names
    */
	static removeInvalidIdChars(_name){

	  console.log(_name);

	  _name = _name == undefined?'':_name;

	  _name = _name.replace('/','');
	  _name = _name.replace('#','');

	  //alert(_name);
	  return _name;

	}    

	static teste123(){
		alert('It Works?');
	} 	
}