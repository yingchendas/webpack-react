import _ from 'lodash';
//import _ from'amazeui-touch/dist/amazeui.touch.min.css'	
function component () {
  var element = document.createElement('div');

  /* lodash is required for the next line to work */
  element.innerHTML = _.join(['Hello','webpack'], ' ');

  return element;
}

document.body.appendChild(component());
