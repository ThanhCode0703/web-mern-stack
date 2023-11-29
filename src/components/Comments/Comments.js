function Comments() {
  // const { dataHref, width } = props;
  return (
    <div className="fb-comments-container">
      <div
        class="fb-comments"
        data-href="https://developers.facebook.com/docs/plugins/comments#configurator"
        data-width="width"
        data-numposts="5"
      ></div>
    </div>
  );
}

export default Comments;
