window.ctcl = {
	submitContactForm: function( token ) {
		var tokenField = document.getElementById( 'recaptcha-token' );
		var contactForm = document.getElementById( 'contact-form' );
		if ( tokenField ) {
			tokenField.value = token;
		}
		if ( contactForm ) {
			contactForm.submit();
		}
	},

	handleAccordionClick: function( e ) {
		var clickedItem = e.currentTarget;

		clickedItem.classList.toggle( 'open' );
	},

	handleMobileMenuClick: function( e ) {
		document.body.classList.toggle( 'menu' );

		// parent element is an <a> tag. Don't want to its click to fire.
		e.preventDefault();
	}
};

document.addEventListener( 'DOMContentLoaded', function() {
	var mobileMenu = document.querySelector( '.mobile-menu' );
	var accordionHeaders = document.querySelectorAll( '.accordion-section-header' );

	accordionHeaders.forEach( function( item ) {
		item.addEventListener( 'click', window.ctcl.handleAccordionClick, { capture: true } );
	} );

	if ( mobileMenu ) {
		mobileMenu.addEventListener( 'click', window.ctcl.handleMobileMenuClick );
	}
} );
