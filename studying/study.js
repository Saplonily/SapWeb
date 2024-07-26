"use strict";

class Student {
    constructor(name, age) {
        this.name = name;
        this.age = age;
    }

    say() {
        console.log(this.name + " is " + this.age + " years old.");
    }
}

let stu = new Student("你好啊", 20);
stu.say();