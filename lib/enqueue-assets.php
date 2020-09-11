<?php

function cyphernex_assets() {
    wp_enqueue_style( 'cyphernex-stylesheet', get_template_directory_uri() . '/dist/assets/css/bundle.css', [], '1', 'all' );
}

add_action( 'wp_enqueue_scripts', 'cyphernex_assets')

?>