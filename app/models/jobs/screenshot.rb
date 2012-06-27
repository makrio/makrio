module Jobs
  class Screenshot < Base
    @queue = :screenshot
    def self.perform(post_id)
      Post.find(post_id).re_screenshot!
    end
  end
end