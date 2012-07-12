//=require "./feedback_view"
app.views.FeedbackActions = app.views.Feedback.extend({
  id : "user-controls",
  templateName : "feedback-actions"
});

app.views.StreamFeedbackActions = app.views.Feedback.extend({
  templateName : "stream-feedback-actions"
});

app.views.ViewerFeedbackActions = app.views.Feedback.extend({
  templateName : "viewer-feedback-actions"
});