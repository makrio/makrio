#   Copyright (c) 2010-2011, Diaspora Inc.  This file is
#   licensed under the Affero General Public License version 3 or later.  See
#   the COPYRIGHT file.

Diaspora::Application.routes.draw do
  if Rails.env.production?
    mount RailsAdmin::Engine => '/admin_panel', :as => 'rails_admin'
  end

  get 'oembed' => 'posts#oembed', :as => 'oembed'
  # Posting and Reading
  resources :reshares
  match "/fb_remix" => "reshares#fb_create"

  resources :status_messages, :only => [:new, :create]

  resources :posts do
    member do
      get :next
      get :previous
      get :interactions
      get :remix, :action =>  'new'
      get :frame
      put :toggle_favorite
      put :toggle_featured
    end

    resources :likes, :only => [:create, :destroy, :index ]
    resources :participations, :only => [:create, :destroy, :index]
    resources :comments, :only => [:new, :create, :destroy, :index]
  end

  get '/bookmarklet.js' => 'bookmarklets#show'
  get "/framer" => 'posts#new'

  get 'p/:id' => 'posts#show', :as => 'short_post'
  get 'posts/:id/iframe' => 'posts#iframe', :as => 'iframe'
  get '/p/:id/screenshot' => 'posts#screenshot'

  # roll up likes into a nested resource above
  resources :comments, :only => [:create, :destroy] do
    resources :likes, :only => [:create, :destroy, :index]
  end

  # Streams
  resource :stream, :only => [:show] do
    get :updated
  end

  get "popular" => "streams#popular", :as => "popular"
  get "hearts" => "streams#likes", :as => "likes_stream"

  resources :aspects do
    put :toggle_contact_visibility
  end

  resources :photos, :except => [:index] do
    put :make_profile_photo
    collection do
      post :legacy
    end
  end

  post "upload_wallpaper" => 'profiles#upload_wallpaper_image'

  # ActivityStreams routes
  scope "/activity_streams", :module => "activity_streams", :as => "activity_streams" do
    resources :photos, :controller => "photos", :only => [:create]
  end

  get 'notifications/read_all' => 'notifications#read_all'
  resources :notifications, :only => [:index, :update] do
  end

  resources :tags, :only => [:index]
  scope "tags/:name" do
    post   "tag_followings" => "tag_followings#create", :as => 'tag_tag_followings'
    delete "tag_followings" => "tag_followings#destroy", :as => 'tag_tag_followings'
  end

  post   "multiple_tag_followings" => "tag_followings#create_multiple", :as => 'multiple_tag_followings'
  resources "tag_followings", :only => [:create]

  get 'tags/:name' => 'tags#show', :as => 'tag'

  # Users and people

  resource :user, :only => [:edit, :update, :destroy], :shallow => true do
    get :getting_started_completed
    get :export
    get :export_photos
  end

  controller :users do
    get 'public/:username'          => :public,           :as => 'users_public'
    get 'getting_started_completed' => :getting_started_completed
    get 'confirm_email/:token'      => :confirm_email,    :as => 'confirm_email'
  end

  # This is a hack to overide a route created by devise.
  # I couldn't find anything in devise to skip that route, see Bug #961
  match 'users/edit' => redirect('/user/edit')

  devise_for :users, :controllers => {:registrations => "registrations",
                                      :password      => "devise/passwords",
                                      :sessions      => "sessions",
                                      :omniauth_callbacks => "users/omniauth_callbacks" }

  devise_scope :user do
    get '/users/auth/:provider' => 'users/omniauth_callbacks#passthru'
  end

  #legacy routes to support old invite routes
  get 'users/invitation/accept' => 'invitations#edit'
  get 'invitations/email' => 'invitations#email', :as => 'invite_email'
  get 'users/invitations' => 'invitations#new', :as => 'new_user_invitation'
  post 'users/invitations' => 'invitations#create', :as => 'new_user_invitation'
  
  get 'login' => redirect('/users/sign_in')

  scope 'admins', :controller => :admins do
    match :user_search
    get   :admin_inviter
    get   :weekly_user_stats
    get   :correlations
    get   :stats, :as => 'pod_stats'
    get   "add_invites/:invite_code_id" => 'admins#add_invites', :as => 'add_invites'
  end

  resource :profile, :only => [:edit, :update]
  resources :profiles, :only => [:show]


  resources :contacts,           :except => [:update, :create] do
    get :sharing, :on => :collection
  end
  resources :aspect_memberships, :only  => [:destroy, :create]
  resources :share_visibilities,  :only => [:update]
  resources :blocks, :only => [:create, :destroy]

  get 'i/:id' => 'invitation_codes#show', :as => 'invite_code'

  get 'people/refresh_search' => "people#refresh_search"
  resources :people, :except => [:edit, :update] do
    resources :status_messages
    resources :photos
    get :contacts
    get "aspect_membership_button" => :aspect_membership_dropdown, :as => "aspect_membership_button"

    member do
      get :last_post
    end

    collection do
      post 'by_handle' => :retrieve_remote, :as => 'person_by_handle'
      get :tag_index
    end
  end
  get '/u/:username' => 'people#show', :as => 'user_profile'
  get '/u/:username/profile_photo' => 'users#user_photo'


  # Federation

  controller :publics do
    get 'webfinger'             => :webfinger
    get 'hcard/users/:guid'     => :hcard
    get '.well-known/host-meta' => :host_meta
    post 'receive/users/:guid'  => :receive
    post 'receive/public'       => :receive_public
    get 'hub'                   => :hub
  end


  resources :services, :only => [:index, :destroy]
  
  get "/done" => 'services#redirect_from_service'


  get 'community_spotlight' => "contacts#spotlight", :as => 'community_spotlight'
  # Mobile site

  get 'mobile/toggle', :to => 'home#toggle_mobile', :as => 'toggle_mobile'

  # Resque web
  if AppConfig[:mount_resque_web]
    mount Resque::Server.new, :at => '/resque-jobs', :as => "resque_web"
  end

  # Startpage
  root :to => 'home#show'
end
