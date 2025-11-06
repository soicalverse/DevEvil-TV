import React from 'react';
import NavBar from '../NavBar';

const About = () => {
	return (
	<div>
<NavBar />


<div style={{

	marginTop: '80px',
	marginLeft:'10px',
  color: 'var(--text)',
  fontWeight: '600',
  textAlign: 'center'

}} className="privacy">

<h1>About Us</h1>
<p>This is a free and open-source movie and tv show streaming site. We offer users the chance to watch their favorite
                        movies and series completely free of charge, without any annoying ads or the
                        need to create an account.
</p>
<br />
<p>Whether you&rsquo;re in the mood for a classic film, a popular TV series, or the latest blockbuster hit, we have something for everyone. With a vast selection of movies and TV shows available, users can easily find what they&rsquo;re looking for and start watching instantly.
</p>
<br />
<p>This site is designed to provide a user-friendly experience that is easy to navigate and free from any distractions. Its intuitive interface ensures that users can quickly find the content they want, while its streaming capabilities allow for seamless playback without any buffering or interruptions.
</p>
<br />
<p>We are committed to providing users with the highest quality streaming experience possible. It is a safe and reliable platform that is constantly updated with the latest content, ensuring that users never run out of new and exciting things to watch.</p>
					</div>
					</div>
	);
  };

export default About;
