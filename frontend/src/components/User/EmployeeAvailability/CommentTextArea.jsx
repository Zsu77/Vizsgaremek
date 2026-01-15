const CommentTextArea = () => {
  return (
    <textarea
      name="comment"
      rows="3"
      placeholder="Reason for the request (optional)"
      className="resize-y border-dashed bg-slate-100 w-full rounded-md mt-2 mb-5 text-lg"
    />
  );
};

export default CommentTextArea;
