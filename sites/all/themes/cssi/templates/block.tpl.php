<div id="<?php print $block_html_id; ?>" class="<?php print $classes; ?>" <?php print $attributes; ?>>
  <?php print render($title_prefix); ?>
  <?php if ($block->subject): ?>
    <div class="block-headline">
      <div class="middle">
        <h2<?php print $title_attributes; ?>><?php print $block->subject ?></h2>
      </div>
    </div>
  <?php endif; ?>
  <?php print render($title_suffix); ?>
  <div class="content" <?php print $content_attributes; ?>>
    <?php print $content ?>
  </div>
</div>
