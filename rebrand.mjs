// rebrand.mjs — swap Lando Norris content for Abdulqavi Mansuri's CV content.
// Run: node rebrand.mjs   (idempotent-ish: re-running reports 0 hits on done items)
import fs from 'node:fs';

const FILE = 'index.html';
let html = fs.readFileSync(FILE, 'utf8');

const TRAILBLAZER = 'https://www.salesforce.com/trailblazer/iamqavi';
const GITHUB = 'https://github.com/uniqavi';
const LINKEDIN = 'https://www.linkedin.com/in/abdulqavimansuri';
const INSTA = 'https://www.instagram.com/qavi.mansuri';
const DEMO = 'https://quietwindow.netlify.app';
const MAIL = 'mailto:qavimansuri@gmail.com';

// [from, to, label]
const R = [
  // ── head / meta ──
  ['2025 McLaren Formula 1 Driver — Lando Norris',
   'Abdulqavi Mansuri — Salesforce &amp; Front-End Developer', 'title/og/twitter title'],
  ['Official hub for British racing star Lando Norris: breaking news, 2025 race wins, exclusive merch, videos and behind-the-scenes access.',
   'Portfolio of Abdulqavi Mansuri — junior Salesforce &amp; front-end developer in Weimar, Germany. Certifications, superbadges, games and experiments.', 'meta descriptions'],

  // ── screen-reader hero ──
  ['<h1 class="screen-reader">Lando Norris</h1><h2 class="screen-reader">2025 Mclaren Formula 1 Driver</h2>',
   '<h1 class="screen-reader">Abdulqavi Mansuri</h1><h2 class="screen-reader">Salesforce &amp; Front-End Developer</h2>', 'screen-reader hero'],

  // ── preloader + rotate overlay ──
  ['>Load Norris<', '>Load Mansuri<', 'preloader pill'],
  ['This is a vertical drive.', 'This is a vertical build.', 'rotate overlay'],
  ['2025 Mclaren Formula 1 Driver', 'Salesforce &amp; Front-End Developer', 'preloader subtitle'],

  // ── eyebrows ──
  ['mclaren f1 since 2019', 'salesforce trailblazer since 2022', 'eyebrow tags'],

  // ── hero next-race card ──
  ['>Next Race<', '>Next Cert<', 'next-race label'],
  ['class="text-eyebrow">Miami</div><div data-anim-high="right, lime" split-text="lines" class="text-eyebrow">gp</div>',
   'class="text-eyebrow">Admin</div><div data-anim-high="right, lime" split-text="lines" class="text-eyebrow">jul 2026</div>', 'next-race name'],

  // ── marquee + statement ──
  ['Message from lando', 'Message from qavi', 'marquee label'],
  ['<strong>Redefining</strong> limits, fighting for <strong>wins</strong>, bringing it all in all ways. Defining a <strong>legacy</strong> in Formula 1 on and off the track.',
   '<strong>Automating</strong> orgs, shipping <strong>front-ends</strong>, bringing it all together. Building a <strong>craft</strong> in Salesforce on and off the platform.', 'statement headline'],

  // ── montage captions (journey: India → Germany) ──
  ['austria, 2020', 'visnagar, 2020', 'caption 1'],
  ['Qatar, 2024', 'Gujarat, 2024', 'caption 2'],
  ['FIA Prize Giving, 2024', 'First Class with Distinction, 2024', 'caption 3'],
  ['Miami GP, 2024', '8BIT Audio, 2024', 'caption 4'],
  ['Monaco, 2023', 'Platform Foundations, 2023', 'caption 5'],
  ['Battersea, 2024', 'SmartInternz, 2022', 'caption 6'],
  ['High Performance Gala, 2024', 'Trailhead Expeditioner, 2025', 'caption 7'],
  ['Barcelona, 2024', 'Ahmedabad, 2024', 'caption 8'],
  ['US, 2024', 'Weimar, 2025', 'caption 9'],
  ['Britain, 2025', 'Bauhaus-Universität, 2025', 'caption 10'],
  ['Since I was 7 years old and had my first experience with kart racing, I’ve worked tirelessly to make that dream come true.',
   'Since my first lines of Java back in Gujarat, I’ve worked steadily to turn curiosity about how things work into a craft.', 'montage quote'],

  // ── ON TRACK / OFF TRACK → ON / OFF PLATFORM ──
  ['line-increase">TRACK</h2>', 'line-increase">PLATFORM</h2>', 'OTOT big words'],
  ['Most recent <strong>results</strong>, career stats and photos from trackside.',
   'Certifications, <strong>superbadges</strong>, flows and dashboards — the Salesforce side of the story.', 'on-platform desc'],
  ['<strong>Campaigns</strong>, shoots and other such promotional materials for fans',
   '<strong>Games</strong>, AR filters, shaders and other experiments built for the joy of it', 'off-platform desc'],
  ['title="On Track page"', 'title="On Platform"', 'btn title 1'],
  ['title="Off Track Page"', 'title="Off Platform"', 'btn title 2'],

  // ── helmets → superbadges hall of fame ──
  ['>Helmets<br/></h2>', '>Superbadges<br/></h2>', 'hall-of-fame heading'],
  ['From his iconic blobs to innovative one-off designs, Lando has always been passionate about designing innovative and memorable helmets.',
   'From security to authentication, a growing wall of Trailhead superbadges and certifications — seven superbadges earned, 92 badges, 71,825 points, and the Admin cert loading.', 'hall-of-fame desc'],
  ['See more helmets and highlights from Lando on the track',
   'See every badge, point and trail on the Trailblazer profile', 'hall-of-fame CTA text'],
  ['>view on track<', '>view trailhead<', 'hall-of-fame CTA btn'],

  // ── helmet grid cards (name + year pairs) ──
  ...[
    ['Season', '2025', 'Admin Cert · WIP', '2026'],
    ['Discoball', '2025', 'Quiet Window', '2026'],
    ['Dark Glitter', '2025', 'Smart Friction', '2026'],
    ['Season', '2024', 'Expeditioner', '2025'],
    ['Porcelain', '2024', '92 Badges', '2025'],
    ['Japan', '2024', '71,825 Points', '2025'],
    ['GIF', '2024', '11 Trails', '2025'],
    ['Dark Mode', '2024', 'M.Sc. Weimar', '2025'],
    ['Race', '2023', 'Security Specialist', '2023'],
    ['Las Vegas', '2023', 'Business Admin', '2023'],
    ['Chrome', '2023', 'Reports &amp; Dashboards', '2023'],
    ['Beachball', '2023', 'User Authentication', '2023'],
    ['Basketball', '2022', 'Auth Settings', '2023'],
    ['Season', '2021', 'Auth Troubleshooting', '2023'],
    ['Silverstone', '2020', 'MFA &amp; SSO', '2023'],
    ['Season', '2019', 'Platform Foundations', '2023'],
  ].map(([n, y, nn, ny]) => [
    `text">${n}</h3><div class="helmet-grid-item-date-w"><div class="text-title-small-label date">${y}</div>`,
    `text">${nn}</h3><div class="helmet-grid-item-date-w"><div class="text-title-small-label date">${ny}</div>`,
    `card ${n} ${y} → ${nn}`, 1, // expect exactly 1, replace first only
  ]),

  // ── store/exe → featured project ──
  ['LANDO STORE', 'FEATURED PROJECT', 'exe eyebrow'],
  ['World Drivers&#x27; <span class="span-font-brier otot">Champion</span>',
   'Operation Quiet <span class="span-font-brier otot">Window</span>', 'exe headline'],
  ['Celebrate this incredible moment with a collection designed for the fans who never stopped believing. Wear it, frame it, treasure it forever.',
   'A browser stealth-puzzle game built with Phaser 3 by an Agile team of four — a fake web-page UI hand-rendered to a 2D canvas, a spatial X-ray scan mechanic, and a visual-novel dialog system in hand-written CSS.', 'exe desc'],
  ['>Visit the store<', '>Play the demo<', 'exe btn'],

  // ── partners → skills & tools ──
  ['e-lg-mona">partners</h2>', 'e-lg-mona">skills</h2>', 'partners heading 1'],
  ['<span class="text-title-lg-brier">&amp;campaigns</span>', '<span class="text-title-lg-brier">&amp;tools</span>', 'partners heading 2'],
  ['Lando is proud to collaborate with a range of partners, who share his passion for performance across a range of industries.',
   'Salesforce Flow and LWC, React and Tailwind, Unity and Phaser, Figma and Claude Code — a toolbox spanning platform configuration, front-end craft and AI-assisted development.', 'partners desc'],
  ['>view partnerships<', '>view github<', 'partners btn'],

  // ── socials callout ──
  ['Follow Lando on social media', 'Follow Abdulqavi around the web', 'socials sub'],

  // ── footer ──
  ['Always <span class="text-impact-sm-brier c-lime-off">bringing</span> the <span class="text-impact-sm-brier c-lime-off">fight</span>.',
   'Always <span class="text-impact-sm-brier c-lime-off">building</span> at the <span class="text-impact-sm-brier c-lime-off">edges</span>.', 'footer headline'],

  // ── nav labels ──
  ['>On Track<', '>On Platform<', 'nav on-track'],
  ['>Off Track<', '>Off Platform<', 'nav off-track'],
  ['>Partnerships<', '>Projects<', 'nav partnerships'],
  ['>Calendar<', '>Contact<', 'nav calendar'],
  ['>Store<', '>GitHub<', 'nav store pill'],

  // ── social labels (menu lowercase + footer capitalized) ──
  ['>tiktok<', '>github<', 'menu tiktok'],
  ['>instagram<', '>linkedin<', 'menu instagram'],
  ['>youtube<', '>instagram<', 'menu youtube'],
  ['>Twitch<', '>Trailblazer<', 'twitch label'],
  ['>Tiktok<', '>GitHub<', 'footer tiktok'],
  ['>Instagram<', '>LinkedIn<', 'footer instagram'],
  ['>Youtube<', '>Instagram<', 'footer youtube'],

  // ── hrefs ──
  ['href="https://www.tiktok.com/@landonorris"', `href="${GITHUB}"`, 'tiktok href'],
  ['href="https://www.instagram.com/lando"', `href="${LINKEDIN}"`, 'instagram href'],
  ['href="https://www.youtube.com/@LandoNorris"', `href="${INSTA}"`, 'youtube href 1'],
  ['href="https://www.youtube.com/landonorris04"', `href="${INSTA}"`, 'youtube href 2'],
  ['href="https://www.twitch.tv/landonorris"', `href="${TRAILBLAZER}"`, 'twitch href'],
  ['href="https://store.landonorris.com/"', `href="${GITHUB}"`, 'store pill href'],
  ['href="https://landonorris.store/"', `href="${DEMO}"`, 'demo btn href'],
  ['href="/on-track"', `href="${TRAILBLAZER}"`, 'on-track href'],
  ['href="/off-track"', `href="${DEMO}"`, 'off-track href'],
  ['href="/partnerships"', `href="${GITHUB}"`, 'partnerships href'],
  ['href="/calendar"', `href="${MAIL}"`, 'calendar href'],
  ['href="mailto:business@landonorris.com"', `href="${MAIL}"`, 'enquiries href'],

  // ── final sweep: any remaining name mentions (copyright, alts) ──
  ['Lando Norris', 'Abdulqavi Mansuri', 'remaining name mentions'],
];

let ok = 0, miss = [];
for (const [from, to, label, firstOnly] of R) {
  const n = html.split(from).length - 1;
  if (n === 0) { miss.push(label); continue; }
  html = firstOnly ? html.replace(from, to) : html.split(from).join(to);
  ok++;
  console.log(`✔ ${label} (${firstOnly ? 1 : n}×)`);
}
fs.writeFileSync(FILE, html);
console.log(`\n${ok}/${R.length} replacements applied.`);
if (miss.length) console.log('MISSED:\n  - ' + miss.join('\n  - '));
