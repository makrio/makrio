//global shims
if(typeof(window.location.origin) == "undefined"){
  window.location.origin = window.location.protocol + '//' + window.location.host
}
function getSubdomain(){
  var urlParts = window.location.host.split(/\./)
    , subdomain = ''

  if(urlParts.length > 2 && urlParts.length < 4) {
    subdomain = urlParts.shift()
  }
  return subdomain
}

window.location.subdomain = getSubdomain
