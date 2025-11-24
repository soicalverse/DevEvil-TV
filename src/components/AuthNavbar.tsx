
import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { SignedIn, SignedOut, UserButton, SignInButton, SignUpButton } from '@clerk/clerk-react';
import './../styles/AuthNavbar.css';

const AuthNavbar: React.FC = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    const modalContent = (
        <div className="modal-overlay" onClick={closeModal}>
            <div className="card_box" onClick={(e) => e.stopPropagation()}>
                <button className="modal-close-btn" onClick={closeModal}>X</button>
                <span></span>
                <SignUpButton mode="modal">
                    <button className="modal-btn get-started-btn">Get Started</button>
                </SignUpButton>
                <SignInButton mode="modal">
                    <button className="modal-btn sign-in-btn">Sign In</button>
                </SignInButton>
            </div>
        </div>
    );

    return (
        <nav className="auth-navbar">
            <div className="auth-navbar-desktop">
                <SignedOut>
                    <SignUpButton mode="modal">
                        <button className="get-started-btn">Get Started</button>
                    </SignUpButton>
                    <SignInButton mode="modal">
                        <button className="sign-in-btn">Sign In</button>
                    </SignInButton>
                </SignedOut>
                <SignedIn>
                    <UserButton />
                </SignedIn>
            </div>

            <div className="auth-navbar-mobile">
                <SignedIn>
                    <UserButton />
                </SignedIn>
                <SignedOut>
                    <div onClick={openModal} className="profile-placeholder">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-user"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                        <span>Profile</span>
                    </div>
                </SignedOut>
            </div>

            {isModalOpen && ReactDOM.createPortal(
                modalContent, 
                document.body
            )}
        </nav>
    );
};

export default AuthNavbar;
