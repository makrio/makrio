//=require "./feedback_view"
app.views.FeedbackActions = app.views.Feedback.extend({
  id : "user-controls",
  templateName : "feedback/feedback-actions"
});

app.views.StreamFeedbackActions = app.views.Feedback.extend({
  templateName : "feedback/stream-feedback-actions"
});

app.views.ViewerFeedbackActions = app.views.Feedback.extend({
  templateName : "feedback/viewer-feedback-actions"
});

app.views.LatestFeedbackActions = app.views.Feedback.extend({
  templateName : "feedback/latest-feedback-actions"
});
