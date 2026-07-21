// WordPress theme code files - production-ready source from the master prompt
// These are the actual deliverable files for the WordPress theme

export type ThemeFile = {
  path: string;
  language: "php" | "css" | "js" | "json" | "txt" | "md";
  description: string;
  content: string;
  category: "theme" | "child" | "elementor" | "template" | "config";
};

export const themeFiles: ThemeFile[] = [
  // ===================== PARENT THEME =====================
  {
    path: "wp-interior-theme/style.css",
    language: "css",
    category: "theme",
    description: "Parent theme stylesheet with theme header and base styles.",
    content: `/*
Theme Name: WP Interior
Theme URI: https://wpinterior.com
Author: WP Interior Studio
Author URI: https://wpinterior.com
Description: Elegant interior design studio WordPress theme with deep Elementor integration. Includes 5 custom Elementor widgets, custom post types for Portfolio & Services, and a full Elementor-compatible design system.
Version: 1.0.0
Requires at least: 6.0
Tested up to: 6.5
Requires PHP: 7.4
License: GNU General Public License v2 or later
License URI: http://www.gnu.org/licenses/gpl-2.0.html
Text Domain: wp-interior
Tags: interior-design, portfolio, elementor, custom-header, custom-menu, full-width
*/

/* -------------------------------------------------------------
   1. Design Tokens (CSS Custom Properties)
   ------------------------------------------------------------- */
:root {
  /* Color Palette */
  --color-cream: #F6F1E7;
  --color-cream-50: #FBF8F1;
  --color-white: #FFFFFF;
  --color-espresso: #211C18;
  --color-espresso-soft: #2A241F;
  --color-gold: #C6A15B;
  --color-gold-deep: #B89048;
  --color-text-gray: #6E6660;
  --color-text-light: #9A8F86;
  --color-heading: #2A241F;
  --color-border: #E5E0D8;

  /* Typography */
  --font-heading: 'Playfair Display', 'Cormorant Garamond', serif;
  --font-body: 'Poppins', 'Jost', sans-serif;
  --font-mono: 'JetBrains Mono', monospace;

  /* Type Scale */
  --text-eyebrow: 0.75rem;
  --text-body: 1rem;
  --text-h1: clamp(2.5rem, 5vw, 4rem);
  --text-h2: clamp(2rem, 3.5vw, 2.75rem);
  --text-h3: clamp(1.5rem, 2.5vw, 1.875rem);

  /* Spacing & Radius */
  --radius-card: 16px;
  --radius-pill: 9999px;

  /* Shadows */
  --shadow-card: 0 4px 24px rgba(0, 0, 0, 0.06);
  --shadow-card-hover: 0 8px 32px rgba(0, 0, 0, 0.12);
  --shadow-elevated: 0 20px 60px rgba(33, 28, 24, 0.15);

  /* Layout */
  --max-width-container: 1200px;
}

/* -------------------------------------------------------------
   2. Base / Reset
   ------------------------------------------------------------- */
*,
*::before,
*::after { box-sizing: border-box; }

html { scroll-behavior: smooth; -webkit-text-size-adjust: 100%; }

body {
  font-family: var(--font-body);
  color: var(--color-text-gray);
  background-color: var(--color-cream-50);
  line-height: 1.65;
  font-weight: 400;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  margin: 0;
}

h1, h2, h3, h4, h5, h6 {
  font-family: var(--font-heading);
  color: var(--color-heading);
  font-weight: 500;
  letter-spacing: -0.01em;
  line-height: 1.15;
  margin: 0 0 0.5em;
}

h1 { font-size: var(--text-h1); }
h2 { font-size: var(--text-h2); }
h3 { font-size: var(--text-h3); }

p { margin: 0 0 1em; }

a {
  color: var(--color-espresso);
  text-decoration: none;
  transition: color 0.25s ease;
}
a:hover { color: var(--color-gold); }

img, svg, video { max-width: 100%; height: auto; display: block; }

/* -------------------------------------------------------------
   3. Utility Components
   ------------------------------------------------------------- */
.container-x {
  max-width: var(--max-width-container);
  margin-left: auto;
  margin-right: auto;
  padding-left: 1.5rem;
  padding-right: 1.5rem;
}
@media (min-width: 1024px) {
  .container-x { padding-left: 2rem; padding-right: 2rem; }
}

.eyebrow {
  font-size: var(--text-eyebrow);
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--color-gold);
  font-weight: 500;
  display: inline-flex;
  align-items: center;
  gap: 1rem;
}
.eyebrow::before,
.eyebrow::after {
  content: "";
  width: 32px;
  height: 1px;
  background-color: var(--color-gold);
}
.eyebrow.no-line::before,
.eyebrow.no-line::after { display: none; }

.text-emphasis { font-style: italic; color: var(--color-gold); font-weight: 500; }

/* -------------------------------------------------------------
   4. Button System
   ------------------------------------------------------------- */
.btn, .elementor-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.875rem 2rem;
  border-radius: var(--radius-pill);
  font-size: 0.8125rem;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  font-weight: 500;
  font-family: var(--font-body);
  cursor: pointer;
  border: 1.5px solid transparent;
  transition: all 0.3s ease;
  text-decoration: none;
  line-height: 1;
}
.btn-gold, .elementor-button.gold {
  background-color: var(--color-gold);
  color: var(--color-espresso);
  border-color: var(--color-gold);
}
.btn-gold:hover, .elementor-button.gold:hover {
  background-color: var(--color-gold-deep);
  border-color: var(--color-gold-deep);
  color: var(--color-espresso);
  transform: translateY(-2px);
  box-shadow: 0 10px 30px rgba(198, 161, 91, 0.3);
}
.btn-outline, .elementor-button.outline {
  background-color: transparent;
  color: var(--color-espresso);
  border-color: var(--color-espresso);
}
.btn-outline:hover, .elementor-button.outline:hover {
  background-color: var(--color-espresso);
  color: var(--color-white);
  transform: translateY(-2px);
}

/* -------------------------------------------------------------
   5. Card System
   ------------------------------------------------------------- */
.wp-interior-card {
  background: var(--color-white);
  border-radius: var(--radius-card);
  box-shadow: var(--shadow-card);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}
.wp-interior-card:hover {
  transform: translateY(-6px);
  box-shadow: var(--shadow-card-hover);
}

/* -------------------------------------------------------------
   6. Section Backgrounds
   ------------------------------------------------------------- */
.section-cream  { background-color: var(--color-cream); }
.section-white  { background-color: var(--color-white); }
.section-espresso {
  background-color: var(--color-espresso);
  color: var(--color-white);
}
.section-espresso h1, .section-espresso h2, .section-espresso h3 { color: var(--color-white); }

/* -------------------------------------------------------------
   7. Elementor Compatibility
   ------------------------------------------------------------- */
.elementor-widget-container { max-width: 100%; }
.elementor-section.elementor-section-full_width { overflow: hidden; }
.elementor-widget-heading h1.elementor-heading-title,
.elementor-widget-heading h2.elementor-heading-title,
.elementor-widget-heading h3.elementor-heading-title {
  font-family: var(--font-heading);
  color: var(--color-heading);
}

/* Elementor form fields */
.elementor-field-group input,
.elementor-field-group textarea,
.elementor-field-group select,
.wpcf7-form input,
.wpcf7-form textarea,
.wpcf7-form select {
  width: 100%;
  padding: 0.875rem 1.125rem;
  border: 1px solid var(--color-border);
  border-radius: 8px;
  font-family: var(--font-body);
  font-size: 0.9375rem;
  color: var(--color-heading);
  background: var(--color-white);
  transition: border-color 0.25s ease, box-shadow 0.25s ease;
}
.elementor-field-group input:focus,
.elementor-field-group textarea:focus,
.elementor-field-group select:focus,
.wpcf7-form input:focus,
.wpcf7-form textarea:focus,
.wpcf7-form select:focus {
  border-color: var(--color-gold);
  outline: none;
  box-shadow: 0 0 0 3px rgba(198, 161, 91, 0.15);
}

/* -------------------------------------------------------------
   8. Responsive
   ------------------------------------------------------------- */
@media (max-width: 1024px) {
  :root { --text-h1: 2.75rem; --text-h2: 2.25rem; --text-h3: 1.625rem; }
}
@media (max-width: 768px) {
  .eyebrow::before, .eyebrow::after { width: 16px; }
  .btn, .elementor-button { width: 100%; }
}

/* -------------------------------------------------------------
   9. Print
   ------------------------------------------------------------- */
@media print {
  body { background: white; color: black; }
  .no-print { display: none !important; }
}`,
  },

  {
    path: "wp-interior-theme/functions.php",
    language: "php",
    category: "theme",
    description: "Parent theme bootstrap. Defines constants, loads modules, sets up theme support, enqueues assets, and registers Elementor locations.",
    content: `<?php
/**
 * WP Interior Theme Functions
 *
 * @package WP_Interior
 * @version 1.0.0
 */

if ( ! defined( 'ABSPATH' ) ) {
    exit; // No direct access.
}

/* =============================================================
   1. Theme Constants
   ============================================================= */
define( 'WP_INTERIOR_VERSION', '1.0.0' );
define( 'WP_INTERIOR_DIR', get_template_directory() );
define( 'WP_INTERIOR_URI', get_template_directory_uri() );

/* =============================================================
   2. Load Theme Modules
   ============================================================= */
require_once WP_INTERIOR_DIR . '/inc/theme-setup.php';
require_once WP_INTERIOR_DIR . '/inc/enqueue-scripts.php';
require_once WP_INTERIOR_DIR . '/inc/elementor-widgets.php';
require_once WP_INTERIOR_DIR . '/inc/custom-post-types.php';
require_once WP_INTERIOR_DIR . '/inc/customizer.php';

/* =============================================================
   3. Theme Setup
   ============================================================= */
function wp_interior_setup() {
    // Core supports
    load_theme_textdomain( 'wp-interior', WP_INTERIOR_DIR . '/languages' );
    add_theme_support( 'title-tag' );
    add_theme_support( 'post-thumbnails' );
    add_theme_support( 'automatic-feed-links' );
    add_theme_support( 'custom-background', array( 'default-color' => 'f6f1e7' ) );
    add_theme_support( 'custom-logo', array(
        'height'      => 80,
        'width'       => 200,
        'flex-height' => true,
        'flex-width'  => true,
    ) );
    add_theme_support( 'html5', array(
        'search-form', 'comment-form', 'comment-list',
        'gallery', 'caption', 'style', 'script',
    ) );
    add_theme_support( 'customize-selective-refresh-widgets' );
    add_theme_support( 'responsive-embeds' );
    add_theme_support( 'align-wide' );
    add_theme_support( 'editor-styles' );
    add_theme_support( 'elementor' );

    // Nav menus
    register_nav_menus( array(
        'primary' => __( 'Primary Menu',  'wp-interior' ),
        'footer'  => __( 'Footer Menu',   'wp-interior' ),
        'mobile'  => __( 'Mobile Menu',   'wp-interior' ),
    ) );

    // Image sizes
    add_image_size( 'portfolio-thumb', 600, 450, true );
    add_image_size( 'portfolio-large', 1200, 800, true );
    add_image_size( 'blog-thumb',      800, 500, true );
    add_image_size( 'hero-slider',     1600, 900, true );
    add_image_size( 'team-member',     500, 600, true );
}
add_action( 'after_setup_theme', 'wp_interior_setup' );

/* =============================================================
   4. Content Width
   ============================================================= */
function wp_interior_content_width() {
    $GLOBALS['content_width'] = apply_filters( 'wp_interior_content_width', 1200 );
}
add_action( 'after_setup_theme', 'wp_interior_content_width', 0 );

/* =============================================================
   5. Sidebars
   ============================================================= */
function wp_interior_widgets_init() {
    register_sidebar( array(
        'name'          => __( 'Blog Sidebar', 'wp-interior' ),
        'id'            => 'sidebar-blog',
        'description'   => __( 'Widgets displayed on blog & archives.', 'wp-interior' ),
        'before_widget' => '<div id="%1$s" class="widget %2$s">',
        'after_widget'  => '</div>',
        'before_title'  => '<h3 class="widget-title">',
        'after_title'   => '</h3>',
    ) );

    register_sidebar( array(
        'name'          => __( 'Footer Column 1', 'wp-interior' ),
        'id'            => 'footer-1',
        'before_widget' => '<div id="%1$s" class="footer-widget %2$s">',
        'after_widget'  => '</div>',
        'before_title'  => '<h4 class="footer-widget-title">',
        'after_title'   => '</h4>',
    ) );
    register_sidebar( array(
        'name'          => __( 'Footer Column 2', 'wp-interior' ),
        'id'            => 'footer-2',
        'before_widget' => '<div id="%1$s" class="footer-widget %2$s">',
        'after_widget'  => '</div>',
        'before_title'  => '<h4 class="footer-widget-title">',
        'after_title'   => '</h4>',
    ) );
    register_sidebar( array(
        'name'          => __( 'Footer Column 3', 'wp-interior' ),
        'id'            => 'footer-3',
        'before_widget' => '<div id="%1$s" class="footer-widget %2$s">',
        'after_widget'  => '</div>',
        'before_title'  => '<h4 class="footer-widget-title">',
        'after_title'   => '</h4>',
    ) );
}
add_action( 'widgets_init', 'wp_interior_widgets_init' );

/* =============================================================
   6. Elementor Theme Locations
   ============================================================= */
function wp_interior_register_elementor_locations( $elementor_theme_manager ) {
    $elementor_theme_manager->register_location( 'header' );
    $elementor_theme_manager->register_location( 'footer' );
    $elementor_theme_manager->register_location( 'single' );
    $elementor_theme_manager->register_location( 'archive' );
}
add_action( 'elementor/theme/register_locations', 'wp_interior_register_elementor_locations' );

/* =============================================================
   7. Helpers
   ============================================================= */
function wp_interior_pagination() {
    the_posts_pagination( array(
        'mid_size'  => 2,
        'prev_text' => '&larr;',
        'next_text' => '&rarr;',
    ) );
}

function wp_interior_post_meta() {
    echo '<div class="post-meta">';
    echo '<span class="posted-on">' . esc_html( get_the_date() ) . '</span>';
    echo '<span class="byline">' . esc_html( get_the_author() ) . '</span>';
    if ( has_category() ) {
        echo '<span class="cat-links">' . get_the_category_list( ', ' ) . '</span>';
    }
    echo '</div>';
}

/* =============================================================
   8. Elementor Pro Custom Fonts (optional)
   ============================================================= */
function wp_interior_register_custom_fonts() {
    return array(
        'Playfair Display' => 'serif',
        'Poppins'          => 'sans-serif',
    );
}
add_filter( 'elementor_pro/frontend/fonts/groups', function( $groups ) {
    $groups['wp_interior_fonts'] = __( 'WP Interior Fonts', 'wp-interior' );
    return $groups;
} );`,
  },

  {
    path: "wp-interior-theme/inc/theme-setup.php",
    language: "php",
    category: "theme",
    description: "Theme setup module — currently a placeholder kept for modular loading.",
    content: `<?php
/**
 * Theme Setup
 *
 * @package WP_Interior
 */

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

/**
 * Editor color palette (Gutenberg / FSE)
 */
function wp_interior_editor_color_palette() {
    add_theme_support( 'editor-color-palette', array(
        array(
            'name'  => __( 'Cream',   'wp-interior' ),
            'slug'  => 'cream',
            'color' => '#F6F1E7',
        ),
        array(
            'name'  => __( 'Espresso', 'wp-interior' ),
            'slug'  => 'espresso',
            'color' => '#211C18',
        ),
        array(
            'name'  => __( 'Gold',    'wp-interior' ),
            'slug'  => 'gold',
            'color' => '#C6A15B',
        ),
        array(
            'name'  => __( 'Text Gray', 'wp-interior' ),
            'slug'  => 'text-gray',
            'color' => '#6E6660',
        ),
        array(
            'name'  => __( 'White',   'wp-interior' ),
            'slug'  => 'white',
            'color' => '#FFFFFF',
        ),
    ) );
}
add_action( 'after_setup_theme', 'wp_interior_editor_color_palette' );

/**
 * Editor font sizes
 */
function wp_interior_editor_font_sizes() {
    add_theme_support( 'editor-font-sizes', array(
        array(
            'name' => __( 'Small',  'wp-interior' ),
            'slug' => 'small',
            'size' => 14,
        ),
        array(
            'name' => __( 'Normal', 'wp-interior' ),
            'slug' => 'normal',
            'size' => 16,
        ),
        array(
            'name' => __( 'Large',  'wp-interior' ),
            'slug' => 'large',
            'size' => 20,
        ),
        array(
            'name' => __( 'Huge',   'wp-interior' ),
            'slug' => 'huge',
            'size' => 28,
        ),
    ) );
}
add_action( 'after_setup_theme', 'wp_interior_editor_font_sizes' );`,
  },

  {
    path: "wp-interior-theme/inc/enqueue-scripts.php",
    language: "php",
    category: "theme",
    description: "Enqueues all theme CSS, JavaScript, and Google Fonts with proper versioning.",
    content: `<?php
/**
 * Enqueue Scripts & Styles
 *
 * @package WP_Interior
 */

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

function wp_interior_enqueue_assets() {
    /* --- Styles --- */
    // Tailwind (compiled)
    wp_enqueue_style(
        'wp-interior-tailwind',
        WP_INTERIOR_URI . '/assets/css/tailwind.css',
        array(),
        WP_INTERIOR_VERSION
    );

    // Base theme stylesheet
    wp_enqueue_style(
        'wp-interior-style',
        get_stylesheet_uri(),
        array( 'wp-interior-tailwind' ),
        WP_INTERIOR_VERSION
    );

    // Custom additions
    wp_enqueue_style(
        'wp-interior-custom',
        WP_INTERIOR_URI . '/assets/css/custom.css',
        array( 'wp-interior-style' ),
        WP_INTERIOR_VERSION
    );

    // Elementor-specific overrides
    wp_enqueue_style(
        'wp-interior-elementor',
        WP_INTERIOR_URI . '/assets/css/elementor.css',
        array( 'wp-interior-custom' ),
        WP_INTERIOR_VERSION
    );

    // Google Fonts (preconnect enabled in functions)
    wp_enqueue_style(
        'wp-interior-fonts',
        'https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500&family=Poppins:wght@300;400;500;600;700&display=swap',
        array(),
        null
    );

    /* --- Scripts --- */
    // Main theme
    wp_enqueue_script(
        'wp-interior-theme',
        WP_INTERIOR_URI . '/assets/js/theme.js',
        array(),
        WP_INTERIOR_VERSION,
        true
    );

    // Hero slider
    wp_enqueue_script(
        'wp-interior-slider',
        WP_INTERIOR_URI . '/assets/js/slider.js',
        array( 'wp-interior-theme' ),
        WP_INTERIOR_VERSION,
        true
    );

    // Portfolio filters
    wp_enqueue_script(
        'wp-interior-filters',
        WP_INTERIOR_URI . '/assets/js/filters.js',
        array(),
        WP_INTERIOR_VERSION,
        true
    );

    // Localize with runtime data
    wp_localize_script( 'wp-interior-theme', 'wpInteriorData', array(
        'ajaxUrl' => admin_url( 'admin-ajax.php' ),
        'nonce'   => wp_create_nonce( 'wp_interior_nonce' ),
        'siteUrl' => site_url(),
        'i18n'    => array(
            'loading' => __( 'Loading…', 'wp-interior' ),
            'loadMore'=> __( 'Load more', 'wp-interior' ),
        ),
    ) );

    // Comment reply
    if ( is_singular() && comments_open() && get_option( 'thread_comments' ) ) {
        wp_enqueue_script( 'comment-reply' );
    }
}
add_action( 'wp_enqueue_scripts', 'wp_interior_enqueue_assets' );

/**
 * Preconnect for Google Fonts (adds to <head>)
 */
function wp_interior_resource_hints( $urls, $relation_type ) {
    if ( 'preconnect' === $relation_type ) {
        $urls[] = array(
            'href' => 'https://fonts.gstatic.com',
            'crossorigin',
        );
        $urls[] = array(
            'href' => 'https://fonts.googleapis.com',
        );
    }
    return $urls;
}
add_filter( 'wp_resource_hints', 'wp_interior_resource_hints', 10, 2 );`,
  },

  {
    path: "wp-interior-theme/inc/elementor-widgets.php",
    language: "php",
    category: "theme",
    description: "Registers all 5 custom Elementor widgets and adds the WP Interior widget category.",
    content: `<?php
/**
 * Register Elementor Custom Widgets
 *
 * @package WP_Interior
 */

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

/**
 * Initialize Elementor Widgets
 */
function wp_interior_register_elementor_widgets() {
    if ( ! did_action( 'elementor/loaded' ) ) {
        return;
    }

    // Include widget classes
    require_once WP_INTERIOR_DIR . '/elementor/widgets/hero-slider.php';
    require_once WP_INTERIOR_DIR . '/elementor/widgets/whatsapp-widget.php';
    require_once WP_INTERIOR_DIR . '/elementor/widgets/stats-counter.php';
    require_once WP_INTERIOR_DIR . '/elementor/widgets/portfolio-grid.php';
    require_once WP_INTERIOR_DIR . '/elementor/widgets/testimonial-slider.php';

    // Register widget instances
    \\Elementor\\Plugin::instance()->widgets_manager->register_widget_type( new \\WP_Interior_Hero_Slider() );
    \\Elementor\\Plugin::instance()->widgets_manager->register_widget_type( new \\WP_Interior_WhatsApp_Widget() );
    \\Elementor\\Plugin::instance()->widgets_manager->register_widget_type( new \\WP_Interior_Stats_Counter() );
    \\Elementor\\Plugin::instance()->widgets_manager->register_widget_type( new \\WP_Interior_Portfolio_Grid() );
    \\Elementor\\Plugin::instance()->widgets_manager->register_widget_type( new \\WP_Interior_Testimonial_Slider() );
}
add_action( 'elementor/widgets/widgets_registered', 'wp_interior_register_elementor_widgets' );

/**
 * Add custom widget category
 */
function wp_interior_add_elementor_widget_categories( $elements_manager ) {
    $elements_manager->add_category(
        'wp-interior',
        array(
            'title' => __( 'WP Interior', 'wp-interior' ),
            'icon'  => 'fa fa-plug',
        )
    );
}
add_action( 'elementor/elements/categories_registered', 'wp_interior_add_elementor_widget_categories' );

/**
 * Add custom CSS to Elementor editor preview
 */
function wp_interior_elementor_editor_styles() {
    wp_enqueue_style(
        'wp-interior-editor',
        WP_INTERIOR_URI . '/assets/css/elementor-editor.css',
        array(),
        WP_INTERIOR_VERSION
    );
}
add_action( 'elementor/editor/after_enqueue_styles', 'wp_interior_elementor_editor_styles' );

/**
 * Add custom JS for Elementor editor
 */
function wp_interior_elementor_editor_scripts() {
    wp_enqueue_script(
        'wp-interior-editor',
        WP_INTERIOR_URI . '/assets/js/elementor-editor.js',
        array( 'jquery' ),
        WP_INTERIOR_VERSION,
        true
    );
}
add_action( 'elementor/editor/after_enqueue_scripts', 'wp_interior_elementor_editor_scripts' );`,
  },

  {
    path: "wp-interior-theme/inc/custom-post-types.php",
    language: "php",
    category: "theme",
    description: "Registers Portfolio and Services custom post types with their taxonomies.",
    content: `<?php
/**
 * Custom Post Types
 *
 * @package WP_Interior
 */

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

/* =============================================================
   1. Portfolio Post Type
   ============================================================= */
function wp_interior_register_portfolio_cpt() {
    $labels = array(
        'name'               => __( 'Portfolio',  'wp-interior' ),
        'singular_name'      => __( 'Project',    'wp-interior' ),
        'add_new'            => __( 'Add New',    'wp-interior' ),
        'add_new_item'       => __( 'Add New Project',  'wp-interior' ),
        'edit_item'          => __( 'Edit Project',     'wp-interior' ),
        'new_item'           => __( 'New Project',      'wp-interior' ),
        'view_item'          => __( 'View Project',     'wp-interior' ),
        'search_items'       => __( 'Search Projects',  'wp-interior' ),
        'not_found'          => __( 'No projects found','wp-interior' ),
        'not_found_in_trash' => __( 'No projects in Trash', 'wp-interior' ),
        'menu_name'          => __( 'Portfolio',  'wp-interior' ),
    );

    $args = array(
        'labels'             => $labels,
        'public'             => true,
        'publicly_queryable' => true,
        'show_ui'            => true,
        'show_in_menu'       => true,
        'query_var'          => true,
        'rewrite'            => array( 'slug' => 'portfolio' ),
        'capability_type'    => 'post',
        'has_archive'        => true,
        'hierarchical'       => false,
        'menu_position'      => 5,
        'menu_icon'          => 'dashicons-portfolio',
        'supports'           => array(
            'title', 'editor', 'thumbnail', 'excerpt',
            'custom-fields', 'revisions', 'elementor',
        ),
        'show_in_rest'       => true,
    );

    register_post_type( 'portfolio', $args );

    // Categories taxonomy
    register_taxonomy( 'portfolio_category', 'portfolio', array(
        'hierarchical' => true,
        'labels'       => array(
            'name'          => __( 'Categories', 'wp-interior' ),
            'singular_name' => __( 'Category',    'wp-interior' ),
            'add_new_item'  => __( 'Add New Category', 'wp-interior' ),
        ),
        'show_ui'      => true,
        'show_in_rest' => true,
        'query_var'    => true,
        'rewrite'      => array( 'slug' => 'portfolio-category' ),
    ) );

    // Tags taxonomy
    register_taxonomy( 'portfolio_tag', 'portfolio', array(
        'hierarchical' => false,
        'labels'       => array(
            'name'          => __( 'Tags', 'wp-interior' ),
            'singular_name' => __( 'Tag',  'wp-interior' ),
        ),
        'show_ui'      => true,
        'show_in_rest' => true,
        'query_var'    => true,
        'rewrite'      => array( 'slug' => 'portfolio-tag' ),
    ) );
}
add_action( 'init', 'wp_interior_register_portfolio_cpt' );

/* =============================================================
   2. Services Post Type
   ============================================================= */
function wp_interior_register_services_cpt() {
    $labels = array(
        'name'          => __( 'Services', 'wp-interior' ),
        'singular_name' => __( 'Service',  'wp-interior' ),
        'add_new_item'  => __( 'Add New Service', 'wp-interior' ),
        'edit_item'     => __( 'Edit Service',    'wp-interior' ),
        'all_items'     => __( 'All Services',    'wp-interior' ),
        'menu_name'     => __( 'Services', 'wp-interior' ),
    );

    $args = array(
        'labels'        => $labels,
        'public'        => true,
        'has_archive'   => true,
        'rewrite'       => array( 'slug' => 'services' ),
        'supports'      => array( 'title', 'editor', 'thumbnail', 'excerpt', 'elementor' ),
        'show_in_rest'  => true,
        'menu_icon'     => 'dashicons-admin-tools',
        'menu_position' => 6,
    );

    register_post_type( 'service', $args );

    register_taxonomy( 'service_category', 'service', array(
        'hierarchical' => true,
        'labels'       => array(
            'name'          => __( 'Service Categories', 'wp-interior' ),
            'singular_name' => __( 'Service Category',   'wp-interior' ),
        ),
        'show_ui'      => true,
        'show_in_rest' => true,
        'rewrite'      => array( 'slug' => 'service-category' ),
    ) );
}
add_action( 'init', 'wp_interior_register_services_cpt' );

/* =============================================================
   3. Testimonials Post Type
   ============================================================= */
function wp_interior_register_testimonials_cpt() {
    $labels = array(
        'name'          => __( 'Testimonials', 'wp-interior' ),
        'singular_name' => __( 'Testimonial',  'wp-interior' ),
        'add_new_item'  => __( 'Add New Testimonial', 'wp-interior' ),
        'menu_name'     => __( 'Testimonials', 'wp-interior' ),
    );

    $args = array(
        'labels'        => $labels,
        'public'        => false,
        'show_ui'       => true,
        'supports'      => array( 'title', 'editor', 'thumbnail' ),
        'menu_icon'     => 'dashicons-format-quote',
        'menu_position' => 7,
    );

    register_post_type( 'testimonial', $args );
}
add_action( 'init', 'wp_interior_register_testimonials_cpt' );

/* =============================================================
   4. Flush Rewrite Rules on Activation
   ============================================================= */
function wp_interior_rewrite_flush() {
    wp_interior_register_portfolio_cpt();
    wp_interior_register_services_cpt();
    wp_interior_register_testimonials_cpt();
    flush_rewrite_rules();
}
add_action( 'after_switch_theme', 'wp_interior_rewrite_flush' );`,
  },

  {
    path: "wp-interior-theme/elementor/widgets/hero-slider.php",
    language: "php",
    category: "elementor",
    description: "Full-width hero slider Elementor widget with Swiper, eyebrow, heading, description, image, and stats repeater.",
    content: `<?php
/**
 * Hero Slider Widget for Elementor
 *
 * @package WP_Interior
 */

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

class WP_Interior_Hero_Slider extends \\Elementor\\Widget_Base {

    public function get_name() {
        return 'wp-interior-hero-slider';
    }

    public function get_title() {
        return __( 'WP Interior · Hero Slider', 'wp-interior' );
    }

    public function get_icon() {
        return 'eicon-slider-push';
    }

    public function get_categories() {
        return array( 'wp-interior' );
    }

    public function get_script_depends() {
        return array();
    }

    public function get_style_depends() {
        return array();
    }

    protected function register_controls() {

        /* --------- Content: Slides --------- */
        $this->start_controls_section(
            'content_section',
            array(
                'label' => __( 'Slides', 'wp-interior' ),
                'tab'   => \\Elementor\\Controls_Manager::TAB_CONTENT,
            )
        );

        $repeater = new \\Elementor\\Repeater();

        $repeater->add_control(
            'eyebrow_text',
            array(
                'label'       => __( 'Eyebrow', 'wp-interior' ),
                'type'        => \\Elementor\\Controls_Manager::TEXT,
                'default'     => __( 'WHERE VISION MEETS DESIGN', 'wp-interior' ),
                'label_block' => true,
            )
        );

        $repeater->add_control(
            'heading',
            array(
                'label'       => __( 'Heading', 'wp-interior' ),
                'type'        => \\Elementor\\Controls_Manager::TEXTAREA,
                'default'     => __( 'Crafting Timeless <em class="text-emphasis">Interior</em> Spaces', 'wp-interior' ),
                'label_block' => true,
            )
        );

        $repeater->add_control(
            'description',
            array(
                'label'   => __( 'Description', 'wp-interior' ),
                'type'    => \\Elementor\\Controls_Manager::TEXTAREA,
                'default' => __( 'Transform your living spaces into timeless works of art where every detail tells a story of elegance and refined taste.', 'wp-interior' ),
            )
        );

        $repeater->add_control(
            'image',
            array(
                'label'   => __( 'Background Image', 'wp-interior' ),
                'type'    => \\Elementor\\Controls_Manager::MEDIA,
                'default' => array(
                    'url' => \\Elementor\\Utils::get_placeholder_image_src(),
                ),
            )
        );

        $repeater->add_control(
            'button_text',
            array(
                'label'   => __( 'Primary Button', 'wp-interior' ),
                'type'    => \\Elementor\\Controls_Manager::TEXT,
                'default' => __( 'VIEW OUR WORK', 'wp-interior' ),
            )
        );

        $repeater->add_control(
            'button_link',
            array(
                'label' => __( 'Primary Button Link', 'wp-interior' ),
                'type'  => \\Elementor\\Controls_Manager::URL,
            )
        );

        $repeater->add_control(
            'secondary_text',
            array(
                'label'   => __( 'Secondary Button', 'wp-interior' ),
                'type'    => \\Elementor\\Controls_Manager::TEXT,
                'default' => __( 'WATCH SHOWREEL', 'wp-interior' ),
            )
        );

        $this->add_control(
            'slides',
            array(
                'label'       => __( 'Slides', 'wp-interior' ),
                'type'        => \\Elementor\\Controls_Manager::REPEATER,
                'fields'      => $repeater->get_controls(),
                'default'     => array(
                    array( 'heading' => __( 'Slide 1', 'wp-interior' ) ),
                    array( 'heading' => __( 'Slide 2', 'wp-interior' ) ),
                ),
                'title_field' => '{{{ heading }}}',
            )
        );

        $this->end_controls_section();

        /* --------- Content: Stats --------- */
        $this->start_controls_section(
            'stats_section',
            array(
                'label' => __( 'Stats', 'wp-interior' ),
                'tab'   => \\Elementor\\Controls_Manager::TAB_CONTENT,
            )
        );

        $stats = new \\Elementor\\Repeater();
        $stats->add_control( 'stat_number', array(
            'label'   => __( 'Number', 'wp-interior' ),
            'type'    => \\Elementor\\Controls_Manager::TEXT,
            'default' => '15+',
        ) );
        $stats->add_control( 'stat_label', array(
            'label'   => __( 'Label', 'wp-interior' ),
            'type'    => \\Elementor\\Controls_Manager::TEXT,
            'default' => 'Years Experience',
        ) );

        $this->add_control(
            'stats',
            array(
                'label'       => __( 'Stats', 'wp-interior' ),
                'type'        => \\Elementor\\Controls_Manager::REPEATER,
                'fields'      => $stats->get_controls(),
                'default'     => array(
                    array( 'stat_number' => '15+',  'stat_label' => 'Years Experience' ),
                    array( 'stat_number' => '320+', 'stat_label' => 'Projects Completed' ),
                    array( 'stat_number' => '98%',  'stat_label' => 'Client Satisfaction' ),
                ),
                'title_field' => '{{{ stat_label }}}',
            )
        );

        $this->end_controls_section();

        /* --------- Style --------- */
        $this->start_controls_section(
            'style_section',
            array(
                'label' => __( 'Style', 'wp-interior' ),
                'tab'   => \\Elementor\\Controls_Manager::TAB_STYLE,
            )
        );

        $this->add_control( 'bg_color', array(
            'label'     => __( 'Background', 'wp-interior' ),
            'type'      => \\Elementor\\Controls_Manager::COLOR,
            'default'   => '#F6F1E7',
            'selectors' => array( '{{WRAPPER}} .wpi-hero' => 'background-color: {{VALUE}};' ),
        ) );

        $this->end_controls_section();
    }

    protected function render() {
        $settings = $this->get_settings_for_display();
        $id       = 'wpi-hero-' . $this->get_id();
        ?>
        <div class="wpi-hero section-cream" id="<?php echo esc_attr( $id ); ?>">
            <div class="container-x">
                <div class="swiper wpi-hero-swiper">
                    <div class="swiper-wrapper">
                        <?php foreach ( $settings['slides'] as $slide ) : ?>
                            <div class="swiper-slide">
                                <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center py-12">
                                    <div class="space-y-6">
                                        <div class="eyebrow no-line">
                                            <span><?php echo esc_html( $slide['eyebrow_text'] ); ?></span>
                                        </div>
                                        <h1 class="font-serif text-heading"><?php echo wp_kses_post( $slide['heading'] ); ?></h1>
                                        <p class="text-base lg:text-lg"><?php echo esc_html( $slide['description'] ); ?></p>
                                        <div class="flex flex-wrap gap-3 pt-2">
                                            <a href="<?php echo esc_url( $slide['button_link']['url'] ?? '#' ); ?>" class="btn btn-gold">
                                                <?php echo esc_html( $slide['button_text'] ); ?>
                                            </a>
                                            <button class="btn btn-outline">
                                                <span class="w-6 h-6 rounded-full border border-current flex items-center justify-center text-[10px]">▶</span>
                                                <?php echo esc_html( $slide['secondary_text'] ); ?>
                                            </button>
                                        </div>
                                        <?php if ( ! empty( $settings['stats'] ) ) : ?>
                                            <div class="flex flex-wrap gap-8 pt-6 border-t border-gold/20">
                                                <?php foreach ( $settings['stats'] as $stat ) : ?>
                                                    <div>
                                                        <div class="font-serif text-3xl lg:text-4xl text-gold font-semibold">
                                                            <?php echo esc_html( $stat['stat_number'] ); ?>
                                                        </div>
                                                        <div class="text-xs uppercase tracking-widest mt-1 text-text-gray">
                                                            <?php echo esc_html( $stat['stat_label'] ); ?>
                                                        </div>
                                                    </div>
                                                <?php endforeach; ?>
                                            </div>
                                        <?php endif; ?>
                                    </div>
                                    <div class="relative">
                                        <img src="<?php echo esc_url( $slide['image']['url'] ); ?>" alt="" class="w-full h-auto rounded-card shadow-card object-cover">
                                        <div class="absolute top-4 right-4 bg-espresso text-white px-4 py-2 rounded-lg text-xs">
                                            Award Winning
                                        </div>
                                    </div>
                                </div>
                            </div>
                        <?php endforeach; ?>
                    </div>
                    <div class="swiper-pagination !relative !mt-10"></div>
                    <div class="swiper-button-prev !text-espresso"></div>
                    <div class="swiper-button-next !text-espresso"></div>
                </div>
            </div>
        </div>
        <script>
        (function(){
            var el = document.querySelector('#<?php echo esc_js( $id ); ?> .wpi-hero-swiper');
            if (el && window.Swiper) {
                new Swiper(el, {
                    loop: true,
                    autoplay: { delay: 5000, disableOnInteraction: false },
                    pagination: { el: el.querySelector('.swiper-pagination'), clickable: true },
                    navigation: {
                        nextEl: el.querySelector('.swiper-button-next'),
                        prevEl: el.querySelector('.swiper-button-prev'),
                    },
                });
            }
        })();
        </script>
        <?php
    }

    protected function content_template() {
        // JS template handled via render()
    }
}`,
  },

  {
    path: "wp-interior-theme/elementor/widgets/whatsapp-widget.php",
    language: "php",
    category: "elementor",
    description: "Floating WhatsApp chat button with configurable phone, message, position, tooltip, and style controls.",
    content: `<?php
/**
 * WhatsApp Floating Widget
 *
 * @package WP_Interior
 */

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

class WP_Interior_WhatsApp_Widget extends \\Elementor\\Widget_Base {

    public function get_name()        { return 'wp-interior-whatsapp'; }
    public function get_title()       { return __( 'WP Interior · WhatsApp', 'wp-interior' ); }
    public function get_icon()        { return 'eicon-whatsapp'; }
    public function get_categories()  { return array( 'wp-interior' ); }

    protected function register_controls() {

        $this->start_controls_section(
            'content_section',
            array(
                'label' => __( 'WhatsApp Settings', 'wp-interior' ),
                'tab'   => \\Elementor\\Controls_Manager::TAB_CONTENT,
            )
        );

        $this->add_control( 'phone_number', array(
            'label'       => __( 'Phone (with country code)', 'wp-interior' ),
            'type'        => \\Elementor\\Controls_Manager::TEXT,
            'default'     => '+1234567890',
            'description' => __( 'Use international format. Example: +971501234567', 'wp-interior' ),
        ) );

        $this->add_control( 'message', array(
            'label'   => __( 'Pre-filled message', 'wp-interior' ),
            'type'    => \\Elementor\\Controls_Manager::TEXTAREA,
            'default' => __( "Hello! I'd like to inquire about your interior design services.", 'wp-interior' ),
        ) );

        $this->add_control( 'position', array(
            'label'   => __( 'Position', 'wp-interior' ),
            'type'    => \\Elementor\\Controls_Manager::SELECT,
            'default' => 'bottom-right',
            'options' => array(
                'bottom-right' => __( 'Bottom Right', 'wp-interior' ),
                'bottom-left'  => __( 'Bottom Left',  'wp-interior' ),
            ),
        ) );

        $this->add_control( 'show_tooltip', array(
            'label'        => __( 'Show Tooltip', 'wp-interior' ),
            'type'         => \\Elementor\\Controls_Manager::SWITCHER,
            'return_value' => 'yes',
            'default'      => 'yes',
        ) );

        $this->add_control( 'tooltip_text', array(
            'label'     => __( 'Tooltip Text', 'wp-interior' ),
            'type'      => \\Elementor\\Controls_Manager::TEXT,
            'default'   => __( 'Chat with us!', 'wp-interior' ),
            'condition' => array( 'show_tooltip' => 'yes' ),
        ) );

        $this->end_controls_section();

        $this->start_controls_section( 'style_section', array(
            'label' => __( 'Style', 'wp-interior' ),
            'tab'   => \\Elementor\\Controls_Manager::TAB_STYLE,
        ) );

        $this->add_control( 'button_color', array(
            'label'     => __( 'Button Color', 'wp-interior' ),
            'type'      => \\Elementor\\Controls_Manager::COLOR,
            'default'   => '#25D366',
            'selectors' => array( '{{WRAPPER}} .wpi-wa-btn' => 'background-color: {{VALUE}};' ),
        ) );

        $this->end_controls_section();
    }

    protected function render() {
        $settings = $this->get_settings_for_display();
        $phone    = preg_replace( '/[^0-9+]/', '', $settings['phone_number'] );
        $msg      = urlencode( $settings['message'] );
        $url      = "https://wa.me/{$phone}?text={$msg}";
        $pos      = 'bottom-right' === $settings['position'] ? 'right-6' : 'left-6';
        ?>
        <div class="wpi-whatsapp fixed bottom-6 <?php echo esc_attr( $pos ); ?> z-50 group">
            <a href="<?php echo esc_url( $url ); ?>"
               target="_blank"
               rel="noopener noreferrer"
               aria-label="WhatsApp"
               class="wpi-wa-btn flex items-center justify-center w-[60px] h-[60px] rounded-full shadow-2xl transition-transform duration-300 hover:scale-110 relative">
                <span class="absolute inset-0 rounded-full bg-[#25D366] animate-ping-slow opacity-60"></span>
                <svg class="relative w-7 h-7 text-white" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884"/>
                </svg>
            </a>
            <?php if ( 'yes' === $settings['show_tooltip'] ) : ?>
                <div class="absolute bottom-full mb-3 right-0 bg-white text-espresso px-4 py-2 rounded-lg shadow-lg whitespace-nowrap text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                    <?php echo esc_html( $settings['tooltip_text'] ); ?>
                    <div class="absolute top-full right-6 w-0 h-0 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-white"></div>
                </div>
            <?php endif; ?>
        </div>
        <?php
    }
}`,
  },

  {
    path: "wp-interior-theme/elementor/widgets/stats-counter.php",
    language: "php",
    category: "elementor",
    description: "Animated stats counter band — used for the dark stats section across the site.",
    content: `<?php
/**
 * Stats Counter Widget
 *
 * @package WP_Interior
 */

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

class WP_Interior_Stats_Counter extends \\Elementor\\Widget_Base {

    public function get_name()        { return 'wp-interior-stats'; }
    public function get_title()       { return __( 'WP Interior · Stats Counter', 'wp-interior' ); }
    public function get_icon()        { return 'eicon-counter'; }
    public function get_categories()  { return array( 'wp-interior' ); }

    protected function register_controls() {

        $this->start_controls_section( 'content_section', array(
            'label' => __( 'Stats', 'wp-interior' ),
            'tab'   => \\Elementor\\Controls_Manager::TAB_CONTENT,
        ) );

        $r = new \\Elementor\\Repeater();
        $r->add_control( 'number', array(
            'label'   => __( 'Number', 'wp-interior' ),
            'type'    => \\Elementor\\Controls_Manager::TEXT,
            'default' => '15+',
        ) );
        $r->add_control( 'label', array(
            'label'   => __( 'Label', 'wp-interior' ),
            'type'    => \\Elementor\\Controls_Manager::TEXT,
            'default' => 'Years Experience',
        ) );

        $this->add_control( 'stats', array(
            'label'       => __( 'Stats', 'wp-interior' ),
            'type'        => \\Elementor\\Controls_Manager::REPEATER,
            'fields'      => $r->get_controls(),
            'default'     => array(
                array( 'number' => '15+',  'label' => 'Years Experience' ),
                array( 'number' => '320+', 'label' => 'Projects Completed' ),
                array( 'number' => '98%',  'label' => 'Client Satisfaction' ),
                array( 'number' => '24',   'label' => 'Design Awards' ),
            ),
            'title_field' => '{{{ label }}}',
        ) );

        $this->add_control( 'style', array(
            'label'   => __( 'Style', 'wp-interior' ),
            'type'    => \\Elementor\\Controls_Manager::SELECT,
            'default' => 'dark',
            'options' => array(
                'dark'  => __( 'Dark / Espresso', 'wp-interior' ),
                'light' => __( 'Light / Cream',   'wp-interior' ),
            ),
        ) );

        $this->end_controls_section();
    }

    protected function render() {
        $s   = $this->get_settings_for_display();
        $cls = 'dark' === $s['style'] ? 'section-espresso' : 'section-cream';
        ?>
        <section class="wpi-stats <?php echo esc_attr( $cls ); ?> py-16 lg:py-20">
            <div class="container-x">
                <div class="grid grid-cols-2 md:grid-cols-4 gap-8">
                    <?php foreach ( $s['stats'] as $stat ) : ?>
                        <div class="text-center">
                            <div class="font-serif text-4xl lg:text-5xl text-gold font-semibold">
                                <?php echo esc_html( $stat['number'] ); ?>
                            </div>
                            <div class="text-xs uppercase tracking-widest mt-2 opacity-80">
                                <?php echo esc_html( $stat['label'] ); ?>
                            </div>
                        </div>
                    <?php endforeach; ?>
                </div>
            </div>
        </section>
        <?php
    }
}`,
  },

  {
    path: "wp-interior-theme/elementor/widgets/portfolio-grid.php",
    language: "php",
    category: "elementor",
    description: "Filterable portfolio grid widget that auto-queries the portfolio CPT with category filters.",
    content: `<?php
/**
 * Portfolio Grid Widget
 *
 * @package WP_Interior
 */

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

class WP_Interior_Portfolio_Grid extends \\Elementor\\Widget_Base {

    public function get_name()        { return 'wp-interior-portfolio'; }
    public function get_title()       { return __( 'WP Interior · Portfolio Grid', 'wp-interior' ); }
    public function get_icon()        { return 'eicon-gallery-grid'; }
    public function get_categories()  { return array( 'wp-interior' ); }

    protected function register_controls() {

        $this->start_controls_section( 'content_section', array(
            'label' => __( 'Query', 'wp-interior' ),
            'tab'   => \\Elementor\\Controls_Manager::TAB_CONTENT,
        ) );

        $this->add_control( 'count', array(
            'label'   => __( 'Items to show', 'wp-interior' ),
            'type'    => \\Elementor\\Controls_Manager::NUMBER,
            'default' => 9,
        ) );

        $this->add_control( 'columns', array(
            'label'   => __( 'Columns', 'wp-interior' ),
            'type'    => \\Elementor\\Controls_Manager::SELECT,
            'default' => '3',
            'options' => array(
                '2' => '2',
                '3' => '3',
                '4' => '4',
            ),
        ) );

        $this->add_control( 'show_filter', array(
            'label'        => __( 'Show Filter Tabs', 'wp-interior' ),
            'type'         => \\Elementor\\Controls_Manager::SWITCHER,
            'return_value' => 'yes',
            'default'      => 'yes',
        ) );

        $this->end_controls_section();
    }

    protected function render() {
        $s = $this->get_settings_for_display();
        $cols = array(
            '2' => 'md:grid-cols-2',
            '3' => 'md:grid-cols-2 lg:grid-cols-3',
            '4' => 'md:grid-cols-2 lg:grid-cols-4',
        );

        $q = new \\WP_Query( array(
            'post_type'      => 'portfolio',
            'posts_per_page' => intval( $s['count'] ),
        ) );

        $cats = get_terms( array( 'taxonomy' => 'portfolio_category', 'hide_empty' => true ) );
        ?>
        <section class="wpi-portfolio section-cream py-20">
            <div class="container-x">
                <?php if ( 'yes' === $s['show_filter'] && ! empty( $cats ) && ! is_wp_error( $cats ) ) : ?>
                    <div class="flex flex-wrap justify-center gap-2 mb-10" data-wpi-filter>
                        <button class="btn btn-gold !py-2 !px-5 !text-[11px] is-active" data-filter="*">All</button>
                        <?php foreach ( $cats as $cat ) : ?>
                            <button class="btn btn-outline !py-2 !px-5 !text-[11px]" data-filter=".cat-<?php echo esc_attr( $cat->slug ); ?>">
                                <?php echo esc_html( $cat->name ); ?>
                            </button>
                        <?php endforeach; }
                    </div>
                <?php endif; ?>

                <div class="grid grid-cols-1 <?php echo esc_attr( $cols[ $s['columns'] ] ?? $cols['3'] ); ?> gap-6" data-wpi-grid>
                    <?php if ( $q->have_posts() ) : while ( $q->have_posts() ) : $q->the_post();
                        $terms = get_the_terms( get_the_ID(), 'portfolio_category' );
                        $cls   = '';
                        if ( $terms && ! is_wp_error( $terms ) ) {
                            foreach ( $terms as $t ) { $cls .= ' cat-' . $t->slug; }
                        }
                    ?>
                        <article class="wpi-portfolio-item <?php echo esc_attr( $cls ); ?>">
                            <a href="<?php the_permalink(); ?>" class="block group relative overflow-hidden rounded-card shadow-card">
                                <?php if ( has_post_thumbnail() ) : ?>
                                    <img src="<?php the_post_thumbnail_url( 'portfolio-thumb' ); ?>" alt="<?php the_title_attribute(); ?>" class="w-full h-72 object-cover transition-transform duration-500 group-hover:scale-110">
                                <?php endif; ?>
                                <div class="absolute inset-0 bg-gradient-to-t from-espresso/90 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                                    <span class="text-gold text-xs uppercase tracking-widest">View Project</span>
                                    <h3 class="font-serif text-2xl text-white mt-2"><?php the_title(); ?></h3>
                                </div>
                            </a>
                        </article>
                    <?php endwhile; wp_reset_postdata(); endif; ?>
                </div>
            </div>
        </section>
        <?php
    }
}`,
  },

  {
    path: "wp-interior-theme/elementor/widgets/testimonial-slider.php",
    language: "php",
    category: "elementor",
    description: "Centered testimonial slider with avatar, quote, name and rating.",
    content: `<?php
/**
 * Testimonial Slider Widget
 *
 * @package WP_Interior
 */

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

class WP_Interior_Testimonial_Slider extends \\Elementor\\Widget_Base {

    public function get_name()        { return 'wp-interior-testimonials'; }
    public function get_title()       { return __( 'WP Interior · Testimonial Slider', 'wp-interior' ); }
    public function get_icon()        { return 'eicon-testimonial-carousel'; }
    public function get_categories()  { return array( 'wp-interior' ); }

    protected function register_controls() {

        $this->start_controls_section( 'content_section', array(
            'label' => __( 'Testimonials', 'wp-interior' ),
            'tab'   => \\Elementor\\Controls_Manager::TAB_CONTENT,
        ) );

        $r = new \\Elementor\\Repeater();
        $r->add_control( 'quote', array(
            'label'   => __( 'Quote', 'wp-interior' ),
            'type'    => \\Elementor\\Controls_Manager::TEXTAREA,
            'default' => __( 'Working with this team transformed not just our home, but the way we live in it.', 'wp-interior' ),
        ) );
        $r->add_control( 'name', array(
            'label'   => __( 'Name', 'wp-interior' ),
            'type'    => \\Elementor\\Controls_Manager::TEXT,
            'default' => 'Sarah Bennett',
        ) );
        $r->add_control( 'role', array(
            'label'   => __( 'Role / Company', 'wp-interior' ),
            'type'    => \\Elementor\\Controls_Manager::TEXT,
            'default' => 'Homeowner · Manhattan',
        ) );
        $r->add_control( 'image', array(
            'label' => __( 'Avatar', 'wp-interior' ),
            'type'  => \\Elementor\\Controls_Manager::MEDIA,
        ) );

        $this->add_control( 'items', array(
            'label'       => __( 'Testimonials', 'wp-interior' ),
            'type'        => \\Elementor\\Controls_Manager::REPEATER,
            'fields'      => $r->get_controls(),
            'default'     => array(
                array( 'name' => 'Sarah Bennett' ),
                array( 'name' => 'David Lin' ),
            ),
            'title_field' => '{{{ name }}}',
        ) );

        $this->end_controls_section();
    }

    protected function render() {
        $s  = $this->get_settings_for_display();
        $id = 'wpi-test-' . $this->get_id();
        ?>
        <section class="wpi-testimonial section-cream py-20">
            <div class="container-x">
                <div class="swiper" id="<?php echo esc_attr( $id ); ?>">
                    <div class="swiper-wrapper">
                        <?php foreach ( $s['items'] as $t ) : ?>
                            <div class="swiper-slide">
                                <div class="max-w-3xl mx-auto text-center card p-10 lg:p-14">
                                    <div class="text-gold text-5xl font-serif">"</div>
                                    <p class="font-serif text-xl lg:text-2xl text-heading italic leading-relaxed my-4">
                                        <?php echo esc_html( $t['quote'] ); ?>
                                    </p>
                                    <div class="flex items-center justify-center gap-4 pt-6 border-t border-gold/20">
                                        <?php if ( ! empty( $t['image']['url'] ) ) : ?>
                                            <img src="<?php echo esc_url( $t['image']['url'] ); ?>" class="w-14 h-14 rounded-full object-cover border-2 border-gold" alt="">
                                        <?php endif; ?>
                                        <div class="text-left">
                                            <div class="font-serif text-lg text-heading"><?php echo esc_html( $t['name'] ); ?></div>
                                            <div class="text-xs uppercase tracking-widest text-text-gray"><?php echo esc_html( $t['role'] ); ?></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        <?php endforeach; ?>
                    </div>
                    <div class="swiper-pagination !relative !mt-8"></div>
                </div>
            </div>
        </section>
        <script>
        (function(){
            var el = document.getElementById('<?php echo esc_js( $id ); ?>');
            if (el && window.Swiper) {
                new Swiper(el, {
                    loop: true,
                    autoplay: { delay: 6000 },
                    pagination: { el: el.querySelector('.swiper-pagination'), clickable: true },
                });
            }
        })();
        </script>
        <?php
    }
}`,
  },

  // ===================== CHILD THEME =====================
  {
    path: "wp-interior-child/style.css",
    language: "css",
    category: "child",
    description: "Child theme stylesheet — imports parent theme and adds customizations.",
    content: `/*
Theme Name: WP Interior Child
Template: wp-interior-theme
Description: Child theme for WP Interior. Use this for client-specific customizations that survive parent theme updates.
Author: WP Interior Studio
Version: 1.0.0
Text Domain: wp-interior-child
*/

/* -------------------------------------------------------------
   1. Import Parent Theme
   ------------------------------------------------------------- */
@import url('../wp-interior-theme/style.css');

/* -------------------------------------------------------------
   2. Child Theme Customizations
   ------------------------------------------------------------- */

/* Tweak: deeper gold on hover */
.btn-gold:hover,
.elementor-button.gold:hover {
  background-color: #A88040;
  border-color: #A88040;
}

/* Tweak: smaller hero on home */
body.home .wpi-hero {
  padding-top: 80px;
  padding-bottom: 80px;
}

/* Tweak: custom scrollbar */
::-webkit-scrollbar-thumb { background: var(--color-gold-deep); }

/* Add your custom CSS below this line.
   Anything in this file overrides the parent and survives updates. */`,
  },

  {
    path: "wp-interior-child/functions.php",
    language: "php",
    category: "child",
    description: "Child theme bootstrap — enqueues parent and child assets, registers a custom sidebar, adds a WhatsApp shortcode.",
    content: `<?php
/**
 * WP Interior Child Theme Functions
 *
 * @package WP_Interior_Child
 * @version 1.0.0
 */

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

/* =============================================================
   1. Enqueue Parent + Child Styles
   ============================================================= */
function wp_interior_child_enqueue_styles() {
    // Parent
    wp_enqueue_style(
        'wp-interior-parent-style',
        get_template_directory_uri() . '/style.css',
        array(),
        wp_get_theme()->parent()->get( 'Version' )
    );

    // Child
    wp_enqueue_style(
        'wp-interior-child-style',
        get_stylesheet_uri(),
        array( 'wp-interior-parent-style' ),
        wp_get_theme()->get( 'Version' )
    );

    // Child custom CSS
    wp_enqueue_style(
        'wp-interior-child-custom',
        get_stylesheet_directory_uri() . '/assets/css/child-custom.css',
        array( 'wp-interior-child-style' ),
        wp_get_theme()->get( 'Version' )
    );

    // Child custom JS
    wp_enqueue_script(
        'wp-interior-child-custom',
        get_stylesheet_directory_uri() . '/assets/js/child-custom.js',
        array( 'jquery' ),
        wp_get_theme()->get( 'Version' ),
        true
    );
}
add_action( 'wp_enqueue_scripts', 'wp_interior_child_enqueue_styles' );

/* =============================================================
   2. Register Custom Sidebar
   ============================================================= */
function wp_interior_child_register_sidebars() {
    register_sidebar( array(
        'name'          => __( 'Custom Sidebar', 'wp-interior-child' ),
        'id'            => 'custom-sidebar',
        'description'   => __( 'Custom sidebar for child theme', 'wp-interior-child' ),
        'before_widget' => '<div id="%1$s" class="widget %2$s">',
        'after_widget'  => '</div>',
        'before_title'  => '<h3 class="widget-title">',
        'after_title'   => '</h3>',
    ) );
}
add_action( 'widgets_init', 'wp_interior_child_register_sidebars' );

/* =============================================================
   3. Add WhatsApp Shortcode
   ============================================================= */
function wp_interior_child_whatsapp_shortcode( $atts ) {
    $atts = shortcode_atts( array(
        'phone'   => '+1234567890',
        'message' => 'Hello! I am interested in your services.',
    ), $atts, 'whatsapp' );

    $phone = preg_replace( '/[^0-9+]/', '', $atts['phone'] );
    $msg   = urlencode( $atts['message'] );
    $url   = "https://wa.me/{$phone}?text={$msg}";

    return '<a href="' . esc_url( $url ) . '" target="_blank" rel="noopener" class="btn btn-gold">
        <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/></svg>
        Chat on WhatsApp
    </a>';
}
add_shortcode( 'whatsapp', 'wp_interior_child_whatsapp_shortcode' );

/* =============================================================
   4. Custom Portfolio Query
   ============================================================= */
function wp_interior_child_custom_query( $atts ) {
    $atts = shortcode_atts( array(
        'category' => '',
        'limit'    => 6,
    ), $atts, 'portfolio' );

    $q = new WP_Query( array(
        'post_type'      => 'portfolio',
        'posts_per_page' => intval( $atts['limit'] ),
        'tax_query'      => $atts['category'] ? array(
            array(
                'taxonomy' => 'portfolio_category',
                'field'    => 'slug',
                'terms'    => explode( ',', $atts['category'] ),
            ),
        ) : array(),
    ) );

    ob_start();
    if ( $q->have_posts() ) :
        echo '<div class="grid grid-cols-1 md:grid-cols-3 gap-6">';
        while ( $q->have_posts() ) : $q->the_post(); ?>
            <article class="card overflow-hidden">
                <a href="<?php the_permalink(); ?>" class="block group">
                    <?php the_post_thumbnail( 'portfolio-thumb', array( 'class' => 'w-full h-72 object-cover transition-transform duration-500 group-hover:scale-110' ) ); ?>
                    <div class="p-6">
                        <h3 class="font-serif text-xl text-heading"><?php the_title(); ?></h3>
                    </div>
                </a>
            </article>
        <?php endwhile;
        echo '</div>';
        wp_reset_postdata();
    endif;
    return ob_get_clean();
}
add_shortcode( 'portfolio', 'wp_interior_child_custom_query' );`,
  },

  // ===================== ELEMENTOR JSON TEMPLATE =====================
  {
    path: "elementor-templates/home-template.json",
    language: "json",
    category: "template",
    description: "Elementor Home page template structure (truncated). Full version includes all 14 sections in the correct order with Elementor's section/column/widget schema.",
    content: `{
  "version": "0.4",
  "title": "WP Interior · Home",
  "type": "page",
  "content": [
    {
      "id": "hero-section",
      "elType": "section",
      "settings": {
        "background_background": "classic",
        "background_color": "#F6F1E7",
        "padding": { "unit": "px", "top": "120", "bottom": "120" }
      },
      "elements": [
        {
          "id": "hero-col",
          "elType": "column",
          "settings": { "_column_size": 100 },
          "elements": [
            {
              "id": "hero-slider-widget",
              "elType": "widget",
              "widgetType": "wp-interior-hero-slider",
              "settings": {
                "slides": [
                  {
                    "eyebrow_text": "WHERE VISION MEETS DESIGN",
                    "heading": "Crafting Timeless <em class=\\"text-emphasis\\">Interior</em> Spaces",
                    "description": "Transform your living spaces into timeless works of art.",
                    "button_text": "VIEW OUR WORK",
                    "secondary_text": "WATCH SHOWREEL"
                  }
                ],
                "stats": [
                  { "stat_number": "15+",  "stat_label": "Years Experience" },
                  { "stat_number": "320+", "stat_label": "Projects Completed" },
                  { "stat_number": "98%",  "stat_label": "Client Satisfaction" }
                ]
              }
            }
          ]
        }
      ]
    },
    {
      "id": "about-section",
      "elType": "section",
      "settings": { "background_background": "classic", "background_color": "#FFFFFF" },
      "elements": [
        {
          "elType": "column",
          "settings": { "_column_size": 50 },
          "elements": [
            { "elType": "widget", "widgetType": "image", "settings": { "image": { "url": "/assets/images/about.jpg" } } }
          ]
        },
        {
          "elType": "column",
          "settings": { "_column_size": 50 },
          "elements": [
            { "elType": "widget", "widgetType": "heading", "settings": { "title": "Where Vision Meets Craftsmanship", "header_size": "h2" } },
            { "elType": "widget", "widgetType": "text-editor", "settings": { "editor": "<p>For over 15 years, we have been designing interiors...</p>" } },
            { "elType": "widget", "widgetType": "button", "settings": { "text": "DISCOVER MORE", "style": "outline" } }
          ]
        }
      ]
    }
    // Sections continue: Services Grid → Stats Band → Portfolio → Process
    // → Testimonials → Team → Pricing → FAQ → Blog → CTA → Contact Form
  ],
  "page_settings": []
}`,
  },

  {
    path: "wp-interior-theme/assets/css/elementor.css",
    language: "css",
    category: "config",
    description: "Elementor-specific style overrides — typography, buttons, cards, pricing, forms, and responsive breakpoints.",
    content: `/* =============================================================
   WP Interior · Elementor Overrides
   ============================================================= */

/* Global typography */
.elementor-widget-heading h1.elementor-heading-title,
.elementor-widget-heading h2.elementor-heading-title,
.elementor-widget-heading h3.elementor-heading-title {
    font-family: var(--font-heading);
    color: var(--color-heading);
    font-weight: 500;
    letter-spacing: -0.01em;
}
.elementor-widget-text-editor {
    font-family: var(--font-body);
    color: var(--color-text-gray);
    line-height: 1.7;
}

/* Eyebrow style class — apply to a heading widget */
.elementor-heading-title.eyebrow-label {
    font-size: 0.75rem;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: var(--color-gold);
    font-weight: 500;
    display: inline-flex;
    align-items: center;
    gap: 1rem;
}
.eyebrow-label::before,
.eyebrow-label::after {
    content: '';
    width: 32px;
    height: 1px;
    background-color: var(--color-gold);
}

/* Gold italic */
.text-emphasis {
    font-style: italic;
    color: var(--color-gold);
}

/* Button styles */
.elementor-button {
    border-radius: 9999px;
    padding: 14px 32px;
    font-size: 0.8125rem;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    font-weight: 500;
    transition: all 0.3s ease;
    font-family: var(--font-body);
}
.elementor-button.gold   { background-color: var(--color-gold);    color: var(--color-espresso); }
.elementor-button.outline{ background-color: transparent; border: 1.5px solid var(--color-espresso); color: var(--color-espresso); }
.elementor-button.outline:hover { background-color: var(--color-espresso); color: white; }

/* Icon Box cards */
.elementor-widget-icon-box .elementor-icon-box-wrapper {
    background: white;
    border-radius: 16px;
    box-shadow: 0 4px 24px rgba(0,0,0,0.06);
    padding: 2.5rem 2rem;
    transition: transform 0.3s ease, box-shadow 0.3s ease;
}
.elementor-widget-icon-box:hover .elementor-icon-box-wrapper {
    transform: translateY(-8px);
    box-shadow: 0 8px 32px rgba(0,0,0,0.12);
}

/* Section dark */
.elementor-section.elementor-section-dark h1,
.elementor-section.elementor-section-dark h2,
.elementor-section.elementor-section-dark h3 { color: white; }

/* Portfolio overlay */
.wpi-portfolio-item a { position: relative; overflow: hidden; border-radius: 16px; display: block; }
.wpi-portfolio-item a img { transition: transform 0.5s ease; }
.wpi-portfolio-item a:hover img { transform: scale(1.1); }

/* Responsive */
@media (max-width: 1024px) {
    .elementor-column { margin-bottom: 1.5rem; }
}
@media (max-width: 768px) {
    .eyebrow-label::before, .eyebrow-label::after { width: 16px; }
    .elementor-button { width: 100%; }
}`,
  },

  {
    path: "wp-interior-theme/assets/js/theme.js",
    language: "js",
    category: "config",
    description: "Main theme JavaScript — sticky header, smooth scroll, mobile nav, and intersection-observer fade-up animations.",
    content: `/**
 * WP Interior · Main Theme JS
 */
(function () {
    'use strict';

    /* -------- Sticky Header -------- */
    const header = document.querySelector('.wpi-header');
    if (header) {
        const onScroll = () => {
            if (window.scrollY > 60) {
                header.classList.add('is-sticky');
            } else {
                header.classList.remove('is-sticky');
            }
        };
        window.addEventListener('scroll', onScroll, { passive: true });
        onScroll();
    }

    /* -------- Smooth Scroll for anchors -------- */
    document.addEventListener('click', function (e) {
        const link = e.target.closest('a[href^="#"]');
        if (!link) return;
        const id = link.getAttribute('href');
        if (id.length < 2) return;
        const target = document.querySelector(id);
        if (target) {
            e.preventDefault();
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });

    /* -------- Mobile Nav Toggle -------- */
    const navToggle = document.querySelector('.wpi-nav-toggle');
    const navMenu   = document.querySelector('.wpi-nav-menu');
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function () {
            navMenu.classList.toggle('is-open');
            navToggle.classList.toggle('is-open');
        });
    }

    /* -------- Fade-up on scroll -------- */
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12 });
    document.querySelectorAll('[data-animate]').forEach((el) => observer.observe(el));

    /* -------- AJAX Portfolio Filter -------- */
    document.querySelectorAll('[data-wpi-filter] button').forEach((btn) => {
        btn.addEventListener('click', function () {
            const filter = this.getAttribute('data-filter');
            const grid   = document.querySelector('[data-wpi-grid]');
            if (!grid) return;
            document.querySelectorAll('[data-wpi-filter] button').forEach((b) => b.classList.remove('is-active'));
            this.classList.add('is-active');
            grid.querySelectorAll('.wpi-portfolio-item').forEach((item) => {
                if (filter === '*' || item.classList.contains(filter.replace('.', ''))) {
                    item.style.display = '';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    });
})();`,
  },

  {
    path: "wp-interior-theme/tailwind.config.js",
    language: "js",
    category: "config",
    description: "Tailwind config — extends the default theme with WP Interior's design tokens (colors, fonts, radii, shadows).",
    content: `/**
 * Tailwind configuration
 *
 * @type {import('tailwindcss').Config}
 */
module.exports = {
    content: [
        './*.php',
        './inc/**/*.php',
        './elementor/**/*.php',
        './template-parts/**/*.php',
        './templates/**/*.php',
        './assets/js/**/*.js',
    ],
    theme: {
        extend: {
            colors: {
                cream: {
                    DEFAULT: '#F6F1E7',
                    50:     '#FBF8F1',
                    100:    '#F6F1E7',
                    200:    '#ECE4D2',
                },
                espresso: {
                    DEFAULT: '#211C18',
                    50:     '#4A413A',
                    100:    '#3A302A',
                    200:    '#2A241F',
                },
                gold: {
                    DEFAULT: '#C6A15B',
                    50:     '#E8D4AC',
                    100:    '#D9BA7E',
                    200:    '#C6A15B',
                    300:    '#B89048',
                },
                'text-gray':  '#6E6660',
                'text-light': '#9A8F86',
                heading:      '#2A241F',
                border:       '#E5E0D8',
            },
            fontFamily: {
                serif: ['"Playfair Display"', 'serif'],
                sans:  ['"Poppins"', 'system-ui', 'sans-serif'],
                mono:  ['"JetBrains Mono"', 'monospace'],
            },
            borderRadius: {
                card:  '16px',
                pill:  '9999px',
            },
            boxShadow: {
                card:       '0 4px 24px rgba(0, 0, 0, 0.06)',
                'card-hover': '0 8px 32px rgba(0, 0, 0, 0.12)',
                elevated:   '0 20px 60px rgba(33, 28, 24, 0.15)',
            },
            maxWidth: {
                container: '1200px',
            },
        },
    },
    plugins: [],
};`,
  },
];
