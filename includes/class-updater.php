<?php
/**
 * Check for theme updates against GitHub releases.
 *
 * @package CTCL\Elections
 * @since 1.0.0
 */

namespace CTCL\Elections;

/**
 * Manage the WordPress theme updates.
 *
 * @package CTCL\Elections
 * @since 1.0.0
 */
class Updater {

	const UPDATE_URL = 'https://api.github.com/repos/usdigitalresponse/election-websites/releases/latest';

	/**
	 * Set up actions and filters.
	 */
	public static function hooks() {
		add_filter( 'pre_set_site_transient_update_themes', [ __CLASS__, 'check' ], 10, 2 );
	}

	/**
	 * Check for updates.
	 *
	 * @param mixed  $value     New value of site transient.
	 * @param string $transient Transient name.
	 *
	 * @return array
	 */
	public static function check( $value, $transient ) {
		if ( ! isset( $value->checked ) ) {
			return $value;
		}

		$cache_key = 'ctcl_election_website_update_data';
		$response  = wp_cache_get( $cache_key );

		if ( false === $response ) {
			$response = wp_remote_get( self::UPDATE_URL ); // phpcs:ignore WordPressVIPMinimum.Functions.RestrictedFunctions.wp_remote_get_wp_remote_get
			wp_cache_set( $cache_key, $response, false, 300 );
		}

		if ( is_wp_error( $response ) ) {
			return $value;
		}

		$response_code = wp_remote_retrieve_response_code( $response );
		if ( 200 !== $response_code ) {
			return $value;
		}

		$result_json = json_decode( $response['body'], true );
		if ( JSON_ERROR_NONE !== json_last_error() ) {
			return $value;
		}

		$new_version     = $result_json['tag_name'];
		$current_version = wp_get_theme()->Version;

		if ( $new_version <= $current_version ) {
			return $value;
		}

		$theme_data = [
			'new_version' => $new_version,
			'url'         => $result_json['html_url'],
			'package'     => $result_json['zipball_url'],
		];

		$theme_response  = [ get_option( 'template' ) => $theme_data ];
		$value->response = array_merge( ! empty( $value->response ) ? $value->response : [], $theme_response );

		return $value;
	}
}

add_action( 'after_setup_theme', [ '\CTCL\Elections\Updater', 'hooks' ] );