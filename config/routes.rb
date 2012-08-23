#   Copyright (c) 2010-2011, Diaspora Inc.  This file is
#   licensed under the Affero General Public License version 3 or later.  See
#   the COPYRIGHT file.

Diaspora::Application.routes.draw do
  if Rails.env.production? || true
    mount RailsAdmin::Engine => '/admin_panel', :as => 'rails_admin'
  end

  get 'oembed' => 'posts#oembed', :as => 'oembed'
  # Posting and Reading
  match "/fb_remix" => "remixes#fb_create"

  resources :status_messages, :only => [:new, :create]

  resources :conversations, :only => [:show]
  post '/conversations/:conversation_id/join' => 'conversations#join'

  post '/posts/:post_id/tags' => 'tags#set'
  resources :relationships, :only => [:create, :destroy]

  get '/:username/following' => 'relationships#following'
  get '/:username/followers' => 'relationships#followers'
  
  resources :posts do
    member do
      get :next
      get :previous
      get :interactions
      get :remix, :action =>  'new'
      get :frame
      get :styleguide, :action => :frame
      put :toggle_favorite
      put :toggle_featured
      put :toggle_staff_picked
    end

    post '/posts/:post_id/tags' => 'tags#set'
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
  get "latest" => "streams#show", :as => 'latest'
  get "latest/updated" => "streams#updated"

  get 'feed' => 'streams#feed', :as => 'feed'

  get "feed/updated" => "streams#feed_updated", :as => 'feed_updated'

  match "stream" => redirect("/latest")
  get "timewarp/:days_ago" => 'streams#show'
  get "timewarp" => 'streams#show'
  get "front_page" => "streams#front_page", :as => "front_page"
  get "likes" => "streams#likes", :as => "likes_stream"
  get "staff_picks" => "streams#staff_picks", :as => "staff_picks_stream"
  get "conversations" => "streams#conversations", :as => "conversations_stream"
  get "interests" => "streams#interests"

  resources :tags, :only => [:index]

  get 'tags/:name' => 'tags#show', :as => 'tag'
  get 'top_tags/' => 'tags#recently_popular'
  get 'topics/' => 'tags#recently_popular'

  get 'search/:query' => 'searchs#show'
  resources :photos, :except => [:index] do
    put :make_profile_photo
    collection do
      post :legacy
    end
  end

  post "upload_wallpaper" => 'profiles#upload_wallpaper_image'

  get 'notifications/read_all' => 'notifications#read_all'
  resources :notifications, :only => [:index, :update] do
  end

  # Users and people

  resource :user, :only => [:edit, :update, :destroy], :shallow => true do
    get :getting_started_completed
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

  get 'mobile/toggle', :to => 'home#toggle_mobile', :as => 'toggle_mobile'

  # Resque web
  if AppConfig[:mount_resque_web]
    mount Resque::Server.new, :at => '/resque-jobs', :as => "resque_web"
  end

  get 'about' => 'infos#about' 
  get 'pro_tips' => 'infos#pro_tips' 
  get 'getting_started' => 'infos#getting_started' 

  get '/tagged/:name/auth_required' => 'tags#auth_show'
  get '/tagged/:name' => 'streams#category'
  get '/topics/:name/auth_required' => 'tags#auth_show'
  get '/topics/:name' => 'streams#category'
  get '/topics/:name/updated' => 'streams#category'
  get '/tagged/:name/updated' => 'streams#category'


  get '/tags' => 'tags#index'
  put '/tags/:id' => 'tags#update', :as => 'acts_as_taggable_on_tag'
  match '', to: 'streams#category', constraints: lambda{ |r| r.subdomain.present?}

  # usernames as first-class citizens; placed at the bottom to keep our defined routes intact.
  get ':username' => 'people#show'#, :constraints => { :username => /[^\/]+/ }
  root :to => 'home#show'
end
