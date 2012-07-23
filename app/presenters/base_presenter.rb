class BasePresenter
  def self.as_collection(collection, current_user, opts = {})
    collection.map{|object| self.new(object, current_user).as_json(opts)}
  end
end
