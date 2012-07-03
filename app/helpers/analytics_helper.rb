#   Copyright (c) 2010-2012, Diaspora Inc.  This file is
#   licensed under the Affero General Public License version 3 or later.  See
#   the COPYRIGHT file.

module AnalyticsHelper
  def include_mixpanel
    include_analytics "mixpanel" do
      javascript_tag do
        <<-JS.html_safe
          (function(c,a){var b,d,h,e;b=c.createElement("script");b.type="text/javascript";b.async=!0;b.src=("https:"===c.location.protocol?"https:":"http:")+'//api.mixpanel.com/site_media/js/api/mixpanel.2.js';d=c.getElementsByTagName("script")[0];d.parentNode.insertBefore(b,d);a._i=[];a.init=function(b,c,f){function d(a,b){var c=b.split(".");2==c.length&&(a=a[c[0]],b=c[1]);a[b]=function(){a.push([b].concat(Array.prototype.slice.call(arguments,0)))}}var g=a;"undefined"!==typeof f?g=
          a[f]=[]:f="mixpanel";g.people=g.people||[];h="disable track track_pageview track_links track_forms register register_once unregister identify name_tag set_config people.set people.increment".split(" ");for(e=0;e<h.length;e++)d(g,h[e]);a._i.push([b,c,f])};a.__SV=1.1;window.mixpanel=a})(document,window.mixpanel||[]);
          mixpanel.init("#{AppConfig[:mixpanel_uid]}");
        JS
      end
    end
  end

  def include_mixpanel_guid
    return unless current_user
    include_analytics "mixpanel" do
      javascript_tag do
        <<-JS.html_safe
          mixpanel.identify("#{current_user.username}");
          mixpanel.people.set({
            "$created": "#{current_user.created_at}"
          })
        JS
      end
    end
  end

  def chartbeat_head_block
    return unless configured?("chartbeat")
    javascript_tag("var _sf_startpt=(new Date()).getTime()")
  end

  def include_chartbeat
    include_analytics "chartbeat" do
      javascript_tag do
        <<-JS.html_safe
          var _sf_async_config = { uid: #{AppConfig[:chartbeat_uid]}, domain: "makr.io" };
          (function() {
            function loadChartbeat() {
              window._sf_endpt = (new Date()).getTime();
              var e = document.createElement('script');
              e.setAttribute('language', 'javascript');
              e.setAttribute('type', 'text/javascript');
              e.setAttribute('src',
                             (('https:' == document.location.protocol) ? 'https://a248.e.akamai.net/chartbeat.download.akamai.com/102508/' : 'http://static.chartbeat.com/') +
                                 'js/chartbeat.js');
              document.body.appendChild(e);
            };
            var oldonload = window.onload;
            window.onload = (typeof window.onload != 'function') ?
                loadChartbeat : function() { oldonload(); loadChartbeat(); };
          })();
        JS
      end
    end
  end

  private

  def include_analytics(service, &block)
    return unless configured?(service)
    yield block
  end

  def configured?(service)
    AppConfig["#{service}_uid".to_sym].present?
  end
end