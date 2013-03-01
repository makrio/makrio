xml.instruct! :xml, version: "1.0" 
xml.rss version: "2.0" do
  xml.channel do
    xml.title "#{@person.name}'s' Makr.io"
    xml.description "#{@person.name}'s' Makr.io"
    xml.link "https://makr.io/#{@person.diaspora_handle.split('@').first}" 

    @articles.each do |article|
      xml.item do
        xml.title article.plain_text
        xml.description article.plain_text
        xml.pubDate article.created_at.to_s(:rfc822)
        xml.link post_url(article)
        xml.guid post_url(article)

        xml.media(:description) do
          xml << begin; image_tag(article.screenshot_url.to_s) rescue end
          xml << "<br/><br/><a href='https://makr.io/posts/#{article.id}/remix'>Remix This</a>"
        end

        xml.media(:content, :url => article.screenshot_url)

        xml.image do |image|
          image.url article.screenshot_url
          image.title "Screenshot of #{article.id}"
          image.url 'https:/makr.io'
          image.width 144
        end
      end
    end
  end
end
