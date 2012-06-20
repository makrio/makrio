#from rbates http://railscasts.com/episodes/355-hacking-with-arel?view=asciicast
#this allows this kinda hotness
#  Product.where(id: 1..5) - Product.where(id: 2) => products in this range, but not 2, in sql
module ScopeOperators
  def or(other)
    left = arel.constraints.reduce(:and)
    right = other.arel.constraints.reduce(:and)
    scope = merge(other)
    scope.where_values = [left.or(right)]
    scope
  end
  alias_method :|, :or

  def not(other)
    left = arel.constraints.reduce(:and)
    right = other.arel.constraints.reduce(:and)
    scope = merge(other)
    scope.where_values = [left, right.not]
    scope
  end
  alias_method :-, :not

  def and(*args)
    merge(*args)
  end
  alias_method :&, :and
end

ActiveSupport.on_load :active_record do
  ActiveRecord::Relation.send(:include, ScopeOperators)
end