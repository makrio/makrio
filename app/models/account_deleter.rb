#   Copyright (c) 2010-2011, Diaspora Inc.  This file is
#   licensed under the Affero General Public License version 3 or later.  See
#   the COPYRIGHT file.

class AccountDeleter

  # Things that are not removed from the database:
  # - Comments
  # - Likes
  # - NotificationActors
  #
  # Given that the User in question will be tombstoned, all of the
  # above will come from an anonomized account (via the UI).
  # The deleted user will appear as "Deleted Account" in
  # the interface.

  attr_accessor :person, :user

  def initialize(diaspora_handle)
    self.person = Person.where(:diaspora_handle => diaspora_handle).first
    self.user = self.person.owner
  end

  def perform!
    #person
    delete_standard_person_associations
    remove_share_visibilities_on_persons_posts
    delete_contacts_of_me
    tombstone_person_and_profile
    
    if self.user
      #user deletion methods
      delete_standard_user_associations
      disassociate_invitations
      disconnect_contacts
      tombstone_user
    end
  end

  #user deletions
  def normal_ar_user_associates_to_delete
    [:invitations_to_me, :services, :user_preferences, :notifications, :blocks]
  end

  def special_ar_user_associations
    [:invitations_from_me, :person]
  end

  def ignored_ar_user_associations
    [:followed_tags, :invited_by, :ignored_people]
  end

  def delete_standard_user_associations
    normal_ar_user_associates_to_delete.each do |asso|
      self.user.send(asso).each{|model| model.delete}
    end
  end

  def delete_standard_person_associations
    normal_ar_person_associates_to_delete.each do |asso|
      self.person.send(asso).delete_all
    end
  end

  def disassociate_invitations
    user.invitations_from_me.each do |inv|
      inv.convert_to_admin!
    end
  end

  def disconnect_contacts
    user.contacts.destroy_all
  end

  def tombstone_person_and_profile
    self.person.lock_access!
    self.person.clear_profile!
  end

  def tombstone_user
    self.user.clear_account!
  end

  def delete_contacts_of_me
    Contact.all_contacts_of_person(self.person).destroy_all
  end
  
  def normal_ar_person_associates_to_delete
    [:posts, :photos, :mentions, :participations, :roles]
  end

  def ignored_or_special_ar_person_associations
    [:comments, :notification_actors, :notifications, :owner, :profile ]
  end
end
