module HelperMethods
  def stub_success(address = 'abc@example.com', opts = {})
    host = address.split('@')[1]
    stub_request(:get, "https://#{host}/.well-known/host-meta").to_return(:status => 200, :body => host_xrd)
    stub_request(:get, "http://#{host}/.well-known/host-meta").to_return(:status => 200, :body => host_xrd)
    if opts[:diaspora] || host.include?("diaspora")
      stub_request(:get, /webfinger\/\?q=#{address}/).to_return(:status => 200, :body => finger_xrd)
      stub_request(:get, "http://#{host}/hcard/users/4c8eccce34b7da59ff000002").to_return(:status => 200, :body => hcard_response)
    else
      stub_request(:get, /webfinger\/\?q=#{address}/).to_return(:status => 200, :body => nonseed_finger_xrd)
      stub_request(:get, 'http://evan.status.net/hcard').to_return(:status => 200, :body => evan_hcard)
    end
  end

  def stub_failure(address = 'abc@example.com')
    host = address.split('@')[1]
    stub_request(:get, "https://#{host}/.well-known/host-meta").to_return(:status => 200, :body => host_xrd)
    stub_request(:get, "http://#{host}/.well-known/host-meta").to_return(:status => 200, :body => host_xrd)
    stub_request(:get, /webfinger\/\?q=#{address}/).to_return(:status => 500)
  end

  def host_xrd
    File.open(File.dirname(__FILE__) + '/fixtures/host_xrd').read
  end

  def finger_xrd
    File.open(File.dirname(__FILE__) + '/fixtures/finger_xrd').read
  end

  def hcard_response
    File.open(File.dirname(__FILE__) + '/fixtures/hcard_response').read
  end

  def nonseed_finger_xrd
    File.open(File.dirname(__FILE__) + '/fixtures/nonseed_finger_xrd').read
  end

  def evan_hcard
    File.open(File.dirname(__FILE__) + '/fixtures/evan_hcard').read
  end

  def uploaded_photo
    fixture_filename = 'button.png'
    fixture_name = File.join(File.dirname(__FILE__), 'fixtures', fixture_filename)
    File.open(fixture_name)
  end
end
