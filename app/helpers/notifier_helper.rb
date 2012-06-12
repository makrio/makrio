module NotifierHelper
  FORTUNE_MESSAGES = [
   "A closed mouth gathers no feet.",
   "The fortune you seek is in another cookie.",
   "You will be hungry again in one hour.",
   "Fortune not found? Abort, Retry, Ignore",
   "Always keep your words soft and sweet, just in case you have to eat them.", 
   "Don't fry bacon in the nude.",
   "Don't kiss an elephant on the lips today.",
   "Back away from individuals who are impulsive.",
   "Punctuality is the politeness of kings and the duty of gentle people everywhere.",
   "A new business venture is on the horizon.",
   "Never underestimate the power of the human touch.",
    "Your present question marks are going to succeed.",
    "You have a fine capacity for the enjoyment of life.",
    "A wish is what makes life happen when you dream of rose petals.",
    "Your wish will come true.",
    "There is a prospect of a thrilling time ahead for you.",
    "Land is always in the mind of the flying birds.",
    "You create your own stage ... the audience is waiting.",
    "Make a wise choice everyday.",
    "Make all you can, save all you can, give all you can.",
    "The time is right to make new friends.",
    "You create your own stage ... the audience is waiting.",
    "Some pursue happiness; you create it.",
    "Vision is the art of seeing what is invisible to others."
  ]

  # @param post [Post] The post object.
  # @param opts [Hash] Optional hash.  Accepts :length and :process_newlines parameters.
  # @return [String] The truncated and formatted post.
  def post_message(post, opts={})
    opts[:length] ||= 200
    if post.respond_to? :formatted_message
      message = truncate(post.formatted_message(:plain_text => true), :length => opts[:length])
      message = process_newlines(message) if opts[:process_newlines]
      message
    else
      I18n.translate 'notifier.a_post_you_shared'
    end
  end

  # @param comment [Comment] The comment to process.
  # @param opts [Hash] Optional hash.  Accepts :length and :process_newlines parameters.
  # @return [String] The truncated and formatted comment.
  def comment_message(comment, opts={})
    opts[:length] ||= 600
    text = truncate(comment.text, :length => opts[:length])
    text = process_newlines(text) if opts[:process_newlines]
    "#{comment.author.nickname} says \"" + text + '"'
  end

  def invite_email_title
    if @inviter.present?
      I18n.t 'notifier.invited_you', :name => @inviter.person.name
    else
      I18n.t 'notifier.accept_invite'
    end
  end

  def fortune_message
    '"' + FORTUNE_MESSAGES.sample + '"'
  end
end
