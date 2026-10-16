export default function CommentForm(){
    return(                
        <form id="comments_form" className="comment-form" >
            <p className="comment-form-author"><input id="name" placeholder="Author" name="author" type="text" defaultValue=""/></p>
            <p className="comment-form-email"><input id="email" required placeholder="Email" name="email" type="email" defaultValue=""/></p>
            <p className="comment-form-comment"><textarea id="comments" placeholder="Type Comment Here" className="form-control4" name="comment" cols={45} rows={3} required></textarea></p>
            <p className="col-md-12 col-sm-12 col-xs-12 form-submit">
                <button id="submit" type="submit" className="submit btn btn-secondary btnhover3 filled">
                    Submit Now
                </button>
            </p>
        </form>
    )
}