class BasePresenter
  def self.as_collection(collection, opts = {})
    collection.map{|object| self.new(object).as_json(opts)}
  end
end
