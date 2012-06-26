#   Copyright (c) 2010-2011, Diaspora Inc.  This file is
#   licensed under the Affero General Public License version 3 or later.  See
#   the COPYRIGHT file.

class ProcessedImage < CarrierWave::Uploader::Base
  include CarrierWave::MiniMagick

  def store_dir
    "uploads/images"
  end

  def extension_white_list
    %w(jpg jpeg png gif)
  end

  def default_url  
    # "/images/fallback/" + [version_name, "default.png"].compact.join('_')
    model.temporary_url
  end

  def filename
    model.random_string + File.extname(@filename) if original_filename
  end
  
  process :get_version_dimensions 
  process :orient_image

  version :thumb_small, :if => :not_gif? do
    process :resize_to_fill => [50,50]
    process :strip
  end
  
  version :thumb_medium, :if => :not_gif?  do
    process :resize_to_limit => [100,100]
    process :strip
  end
  
  version :thumb_large, :if => :not_gif?  do
    process :resize_to_limit => [300,300]
    process :strip
  end

  version :scaled_full, :if => :not_gif?  do
    process :resize_to_limit => [700,700]
    process :strip
  end

  def strip
    manipulate! do |img|
      img.strip
      img = yield(img) if block_given?
      img
    end
  end

  def orient_image
    manipulate! do |img|
      img.auto_orient
      img
    end
  end

  def get_version_dimensions
    model.width, model.height = `identify -format "%wx%h " #{file.path}`.split(/x/)
  end

  def not_gif?(new_file)
    !original_filename.include?('.gif')
  end
end