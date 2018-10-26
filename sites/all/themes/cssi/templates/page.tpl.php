<!--start nci_header-->
<?php if ($alt_header): ?>
<div class="row full-width banner minibar">
    <div class="minibanner-white">
        <section class="row <?php print $alt_header_classes; ?>">

            <div class="large-9 columns left-banner-block">
                <?php if (!empty($page['minibarlogo'])): ?>
                <?php print render($page['minibarlogo']); ?>
                <?php endif; ?>
            </div>
            <div class="large-3 columns right-search-block">
                <?php if (!empty($page['search'])): ?>
                <?php print render($page['search']); ?>
                <?php endif; ?>
            </div>
        </section>
    </div>
</div>
<?php endif; ?>
<!--end nci_header-->
<!--start nci_slogan-->
<?php if (!empty($page['minibarslogan'])): ?>
<div class="row full-width banner minibarslogan">
    <section class="row <?php print $alt_header_classes; ?>">
        <div class="large-12 columns slogan-banner-block">
            <?php print render($page['minibarslogan']); ?>
        </div>
    </section>
</div>
<?php endif; ?>
<!--end nci_slogan-->

<!--.page -->
<div role="document" class="page">


    <div class="row full-width header">

        <!--.l-header region -->
        <header role="banner" class="l-header">

            <?php if ($top_bar): ?>
            <!--.top-bar -->
            <?php if ($top_bar_classes): ?>
            <div class="<?php print $top_bar_classes; ?>">
                <?php endif; ?>
                <nav class="top-bar" <?php print $top_bar_options; ?>>
                    <ul class="title-area">
                        <li class="name">
                            <h1>
                                <?php print $linked_site_name; ?>
                            </h1>
                        </li>
                        <li class="toggle-topbar menu-icon"><a href="#"><span><?php print $top_bar_menu_text; ?></span></a>
                        </li>
                    </ul>
                    <section class="top-bar-section">
                        <?php if ($top_bar_main_menu) :?>
                        <?php print $top_bar_main_menu; ?>
                        <?php endif; ?>
                        <?php if ($top_bar_secondary_menu) :?>
                        <?php print $top_bar_secondary_menu; ?>
                        <?php endif; ?>
                    </section>
                </nav>
                <?php if ($top_bar_classes): ?>
            </div>
            <?php endif; ?>
            <!--/.top-bar -->
            <?php endif; ?>

            <!-- Title, slogan and menu -->
            <?php if ($alt_header): ?>
            <section class="row <?php print $alt_header_classes; ?>">

                <div class="large-12 columns right-head-block-menu">
                    <div class="large-12 columns menu-wrapper">
                        <?php if (!empty($page['menu'])): ?>
                        <?php print render($page['menu']); ?>
                        <?php endif; ?>
                    </div>
                </div>

            </section>
            <?php endif; ?>
            <!-- End title, slogan and menu -->

        </header>
        <!--/.l-header -->

    </div>
    <!--/.row.full-width.header-->

    <!--.l-header-region -->
    <!--<div class="row full-width header-banner">
    <div class="row">
        <div class="large-12 columns title-banner">
            <div class="page-title-wrapper"></div>
        </div>
    </div>
</div>-->
    <?php if (!empty($page['banner_image'])): ?>
    <!--.l-header-region -->
    <!--<section class="l-header-region row">-->
    <div class="row full-width header-banner">
        <div class="large-12 columns title-banner">
            <center>
                <?php print render($page['banner_image']); ?>
            </center>
        </div>
    </div>
    <!--/.l-header-region -->
    <?php endif; ?>
    <!--/.l-header-region -->



    <div class="row full-width main">

        <main role="main" class="row l-main">

            <?php if (!empty($page['featured'])): ?>
            <!--/.featured -->
            <section class="l-featured row">
                <div class="large-12 columns">
                    <?php print render($page['featured']); ?>
                </div>
            </section>
            <!--/.l-featured -->
            <?php endif; ?>

            <?php if ($messages && !$zurb_foundation_messages_modal): ?>
            <!--/.l-messages -->
            <section class="l-messages row">
                <div class="large-12 columns">
                    <?php if ($messages): print $messages; endif; ?>
                </div>
            </section>
            <!--/.l-messages -->
            <?php endif; ?>

            <?php if (!empty($page['help'])): ?>
            <!--/.l-help -->
            <section class="l-help row">
                <div class="large-12 columns">
                    <?php print render($page['help']); ?>
                </div>
            </section>
            <!--/.l-help -->
            <?php endif; ?>

            <section class="l-breadcrumb columns large-12">
                <div class="large-12">
                    <?php if ($breadcrumb): print $breadcrumb; endif; ?>
                </div>
            </section>
            <!--/.l-breadcrumb -->

            <div class="<?php print $main_grid; ?> main columns main-content-wrapper">

                <div class="main-content">

                    <?php if (!empty($page['highlighted'])): ?>
                    <div class="highlight panel callout">
                        <?php print render($page['highlighted']); ?>
                    </div>
                    <?php endif; ?>

                    <a id="main-content"></a>

                    <h1 id="page-title" class="title">
                        <?php print $title; ?>
                    </h1>
                    <hr class="gray">

                    <?php if (!empty($tabs)): ?>
                    <?php print render($tabs); ?>
                    <?php if (!empty($tabs2)): print render($tabs2); endif; ?>
                    <?php endif; ?>

                    <?php if ($action_links): ?>
                    <ul class="action-links">
                        <?php print render($action_links); ?>
                    </ul>
                    <?php endif; ?>

                    <?php print render($page['content']); ?>
                </div>
                <!--/.main-content -->

            </div>
            <!--/.main region -->

            <?php if (!empty($page['sidebar_first'])): ?>
            <aside role="complementary" class="<?php print $sidebar_first_grid; ?> sidebar-first columns sidebar">
                <?php print render($page['sidebar_first']); ?>
            </aside>
            <?php endif; ?>

            <?php if (!empty($page['sidebar_second'])): ?>
            <aside role="complementary" class="<?php print $sidebar_sec_grid; ?> sidebar-second columns sidebar">
                <?php print render($page['sidebar_second']); ?>
            </aside>
            <?php endif; ?>
        </main>
        <!--/.main-->

    </div>
    <!--/.row.full-width.main-->

    <div class="row full-width footer">

        <!--.l-footer-->
        <footer class="l-footer row" role="contentinfo">
            <?php if (!empty($page['footer'])): ?>
            <div class="footer large-12 columns">
                <?php print render($page['footer']); ?>
            </div>
            <?php endif; ?>

            <?php if ($site_name) :?>
            <div class="copyright large-12 columns">
                &copy;
                <?php print date('Y') . ' ' . check_plain($site_name) . ' ' . t('All rights reserved.'); ?>
            </div>
            <?php endif; ?>
        </footer>
        <!--/.footer-->

        <?php if ($messages && $zurb_foundation_messages_modal): print $messages; endif; ?>

    </div>
    <!--/.row.full-width.footer-->

</div>
<!--/.page -->