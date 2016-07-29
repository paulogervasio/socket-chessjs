"use strict";

class Produto{
    constructor(nome){
        this.nome = nome;
    }
    lista(){
      alert('calling methods');
    }
    static teste(){
      alert('a static method was created');
    }
}