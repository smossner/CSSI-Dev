<?php


/**
 * Implements hook_form_alter().
 */
function cssi_form_alter( array & $form, array & $form_state = array(), $form_id = NULL ) {
	
  if ($form_id) {
    switch ($form_id) {
      case 'search_block_form':
        $form['search_block_form']['#theme_wrappers'] = array('search_form_wrapper');
        $form['#attributes']['class'][] = 'form-search';
        $form['search_block_form']['#title'] = 'Search';
        $form['search_block_form']['#attributes']['placeholder'] = t('Search...');
        //control the width of the input
        $form['search_block_form']['#attributes']['class'][] = 'wide input headsearch';
        $form['search_block_form']['#attributes']['id'][] = 'search-form';

        // Hide the default button from display and implement a theme wrapper
        // to add a submit button containing a search icon directly after the
        // input element.
        $form['actions']['submit']['#attributes']['class'][] = 'element-invisible';


        // Apply a clearfix so the results don't overflow onto the form.
        $form['#attributes']['class'][] = 'content-search';
        break;
    }
  }
}
/**
 * Theme function implementation for MYTHEME_search_form_wrapper.
 */
function cssi_search_form_wrapper( $variables ) {
  $output = '<div class="field append">';
  $output .= $variables['element']['#children'];
  $output .= '<button type="submit" class="medium primary btn small-4 headsearch-btn">';
  $output .= '<span class="icon-search entypo scale-lg"><label for="search-form">SEARCH</label></span>';
//  $output .= '<span class="element-invisible"><label for="search-block-form">' . t('Search') . '</label></span>';
  $output .= '</button>';
  $output .= '</div>';
  return $output;
}


/**
 * Stub implementation for hook_theme().
 *
 * @see MYTHEME_theme()
 * @see hook_theme()
 */
function cssi_theme( & $existing, $type, $theme, $path ) {
	// Custom theme hooks:
	// Do not define the `path` or `template`.
	$hook_theme = array(
		'search_form_wrapper' => array(
			'render element' => 'element',
		),
	);
	return $hook_theme;
}
/** Removed content block from homepage **/
function cssi_preprocess_page( & $variables ) {
	if ( $variables[ 'is_front' ] ) {
		$variables[ 'title' ] = '';
		unset( $variables[ 'page' ][ 'content' ][ 'system_main' ][ 'default_message' ] );
	}
}
/** Builds custom menu source **/
function cssi_links__system_main_menu( $variables ) {
	$html = "<div>\n";
	$html .= "  <ul>\n";
	foreach ( $variables[ 'links' ] as $link ) {
		$html .= "<li>" . l( $link[ 'title' ], $link[ 'path' ], $link ) . "</li>";
	}
	$html .= "  </ul>\n";
	$html .= "</div>\n";
	return $html;
}
/**
 * Process variables for search-result.tpl.php.
 *
 * @see search-result.tpl.php
 */
function cssi_preprocess_search_result( & $variables ) {
	// Remove user name and modification date from search results
	$variables[ 'info' ] = '';
}
