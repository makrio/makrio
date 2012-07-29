atom_feed do |feed|
  feed.title "#{@person.name}'s' Makr.io"
  feed.updated @articles.maximum(:updated_at)
  
  @articles.each do |article|
    feed.entry(article, published: article.created_at, url:post_url(article)) do |entry|
      entry.title article.plain_text
      entry.content article.plain_text
      entry.media(:description) do
        entry << image_tag(article.screenshot_url.to_s) 
      end

      entry.media(:content, :url => article.screenshot_url)


      entry.author do |author|
        author.name @person.name
      end

      entry.image do |image|
        image.url article.screenshot_url
        image.title "Screenshot of #{article.id}"
        image.url 'https:/makr.io'
        image.width 144
      end
    end
  end
end