function Comments(props) {
  // console.log(props);
  // const { dataHref, width } = props;
  console.log(process.env.REACT_APP_API_KEY_2);
  return (
    <div className="fb-comments-container">
      <div
        class="fb-comments"
        data-href={`${process.env.REACT_APP_API_KEY_2}/${props.linkCmt}`}
        data-width="1010"
        data-numposts="5"
      ></div>
    </div>
  );
}

export default Comments;
