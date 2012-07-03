module ServicesHelper
  @@contact_proxy = Contact.new(:aspects => [])
  def contact_proxy(friend)
    friend.contact || @@contact_proxy.dup.tap{|c| c.person = friend.person}
  end

  def remix_button_url
    AppConfig[:pod_url] + "framer?bookmarklet=true&remoteurl="
  end

  def bookmarklet_url
    return "javascript:void(function(){ if(window.location.host.match(/makr/)){alert('Drag the \"Remix\" button to your bookmarks bar to easily remix any photo while you browse the web!');return};\
    if(document.getElementsByTagName('head').length ==0){document.getElementsByTagName('html')[0].appendChild(document.createElement('head'))} \
    var head= document.getElementsByTagName('head')[0]; \
    var script= document.createElement('script'); \
    script.type= 'text/javascript'; \
    script.src= '" + AppConfig[:pod_uri].host +  "/bookmarklet.js'; \
    script.id= 'makrio-bm-script'; \
    script.setAttribute('data-origin','" + AppConfig[:pod_uri].host + "'); \
    head.appendChild(script);}());";
  end
end
