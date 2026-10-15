import Link from "next/link";

const GetInTouch = () => {
    return (
        <section className="content-inner-1 p-t0">
			<div className="container">
				<div className="get-in-touch rounded">
					<div className="m-r100 m-md-r0 m-sm-r0 wow fadeInUp" data-wow-delay="0.1s">
						<h3 className="dz-title mb-lg-0 mb-3">Questions ?
							<span>Our experts will help find the grar that’s right for you</span>
						</h3>
					</div>
					<Link href="/contact-us-1" className="btn btn-light">Get In Touch</Link>
				</div>
			</div>
		</section>
    );
};

export default GetInTouch;