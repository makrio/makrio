//global shims
if(typeof(window.location.origin) == "undefined"){
  window.location.origin = window.location.protocol + '//' + window.location.host
}
function getSubdomain(){
  var host = window.location.host
  var urlParts = host.split('.')
  var subdomain = ''

  if(!(urlParts.length == 1)) {
    var subdomain = urlParts.shift()
    if(subdomain == 'www'){subdomain = urlParts.shift()}
  }
  return subdomain
}

window.location.subdomain = getSubdomain
