<?php

function __themename_post_meta(){
    /* translators: %s Post Date */
    printf(
        esc_html__( 'posted on %s', 'Cypher Nex' ),
        '<a href="' . esc_url(get_permalink()) . '" >
                <time datetime="' . esc_attr(get_the_date('c')) .'"> '. get_the_date() .'</time></a>'
    );
    /* translators: %s Post Author */
    printf(
        esc_html__( ' By %s', 'Cypher Nex' ),
            '<a href="'. esc_url(get_author_posts_url(get_the_author_meta('ID'))) . '"> '. esc_html(get_the_author()) .'</a>'
    );
}

function __themename_readmore_link(){

    echo '<a href="' . esc_url(get_the_permalink()) . '" title="' . the_title_attribute(['echo' => false]) . '" >';
    printf(
        esc_html__( 'Read More %s', 'Cypher Nex' ),
        '<span class="u-screen-reader-text">'
    );
    /* translators: %s Post Title */
    printf(
        wp_kses( __('Read More <span class="u-screen-reader-text">About %s</span>', 'Cypher Nex'),
         [
             'span' => [
                 'class' => []
             ]
         ],
        ),
        get_the_title()
    );
    echo '</a>';

}

?>