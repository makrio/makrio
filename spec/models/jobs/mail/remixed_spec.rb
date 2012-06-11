#   Copyright (c) 2010-2011, Diaspora Inc.  This file is
#   licensed under the Affero General Public License version 3 or later.  See
#   the COPYRIGHT file.

require 'spec_helper'

describe Jobs::Mail::Remixed do
  describe '#perfom' do
    it 'should work' do
      post = Factory(:status_message, :root => Factory(:status_message, :author => bob.person))
      note =Notifications::Remixed.create_from_post(post)
      Jobs::Mail::Remixed.perform(note.id)
    end
  end
end
