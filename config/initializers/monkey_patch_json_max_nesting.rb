module JSON
  class << self
    def parse(source, opts = {})
      opts = ({:max_nesting => 100}).merge(opts)
      Parser.new(source, opts).parse
    end
  end
end