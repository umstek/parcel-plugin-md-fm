import { data, content } from "./markdown.md";

var dataText = document.createTextNode(JSON.stringify(data, null, 2));
var dataNode = document.createElement("pre");
dataNode.style.color = "blue";
dataNode.appendChild(dataText);

var contentText = document.createTextNode(content);
var contentNode = document.createElement("pre");
contentNode.appendChild(contentText);

var rootNode = document.createElement("div");
rootNode.appendChild(dataNode);
rootNode.appendChild(contentNode);

document.body.appendChild(rootNode);
