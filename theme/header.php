<?php
/**
 * The template for displaying the header.
 *
 * @package CTCL\ElectionWebsite
 * @since 1.0.0
 */
?>
<!DOCTYPE html>
<html <?php language_attributes(); ?>>
<head>
	<meta charset="<?php bloginfo( 'charset' ); ?>">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<?php wp_head(); ?>
</head>

<body <?php body_class(); ?>>

<header>
	<?php
		bloginfo( 'title' );

		?>
		<img src="<?php echo esc_url( get_template_directory_uri() . '/assets/images/nevada.svg' ); ?>" alr="Nevada County" height="56" width="56" />

		<?php
		wp_nav_menu([
			'menu' => 'top-nav-menu'
		]);
	?>
</header>

<section class="banner">
	<div>
		<img src="<?php echo esc_url( get_template_directory_uri() . '/assets/images/envelope.png' ); ?>" alr="Envelope" width="195" height="93" />

		<h1>Vote by Mail in Upcoming Elections</h1>
		<p>To help prevent the community spread of COVID-19, all registered, eligible voters may apply to vote by mail ballot. Learn more</p>
	</div>
</section>