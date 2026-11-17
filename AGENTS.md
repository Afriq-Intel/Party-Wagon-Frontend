<!-- BEGIN:nextjs-agent-rules -->

This is NOT the Next.js you know
This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in node_modules/next/dist/docs/ (resolved from this file's directory; in monorepos the next package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by next dev — verify at node_modules/next/dist/server/lib/generate-agent-files.js. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

Party Wagon — Frontend Agent Instructions

1. Project Overview and Brand Strategy
   Party Wagon is a convenient online boutique drinks and party-food retail/concierge service, focused initially on Ghana and with a broader ambition across Africa. It helps customers organise gatherings by making party platters, finger foods, drinks, and other party needs easier to discover and order online or through an app. The service should support fast, dependable delivery and flexible scheduling where the operations and backend support it.

Core customer need
The brand responds to the difficulty of staying connected and bringing friends and family together when costs and planning hurdles make gatherings harder. The digital experience should remove friction from planning so customers can focus on spending time with people they care about.

Brand promise
Party Wagon's promise is to bring the party to customers with just a click of a button. The experience should communicate convenience, dependability, and the excitement of getting together.

Brand values
Openness
Dependability
Agility
Boldness
Enthusiasm
Brand personality
Fun, friendly, vibrant, and innovative. The experience should feel approachable and energetic without becoming confusing, cluttered, or difficult to use.

Core differentiators
Personalised, high-quality customer service.
A convenient one-stop shop for party needs.
The current frontend assignment is Customer Catalogue Browsing. Keep work focused on the task currently assigned by the human developer while ensuring that the experience supports Party Wagon's wider promise.

2. Source of Truth and Design References
   Party Wagon has three design references. They have different purposes and must not be treated as interchangeable.

A. Party Wagon Figma files — primary design specification
The supplied Party Wagon Figma files are the source of truth for the actual Party Wagon interface.

Design approval status — important
The supervisor has currently approved:

The customer homepage.
The customer-facing screens/designs.
All other areas and role-specific designs remain under supervisor review and must not be treated as approved implementation specifications. This includes Operations, Driver, Partner/Vendor, and any other non-customer dashboard or workflow designs unless the human developer confirms a later approval.

For screens still under review:

Do not implement them as final approved UI.
Do not assume their layouts, workflows, or components are locked.
They may be inspected for context, but wait for explicit approval before building them as production screens.
If a task appears to require an unapproved screen, ask the human developer whether the supervisor has approved it before proceeding.
Only the approved homepage and customer-facing designs should be treated as confirmed visual specifications at this stage.

Follow the approved screen layouts, component designs, spacing, typography, colours, and responsive behaviour shown in Figma.
Reuse the established design system and components where available.
Do not replace an approved Figma design with a design copied from either reference website.
When a required state or interaction is not covered by Figma, use the interaction guidance below and make the smallest consistent design decision. Flag significant gaps to the human developer rather than inventing a new visual direction.
B. Drink Joy Rush — visual inspiration
Website: https://drinkjoyrush.com/

Use Drink Joy Rush as inspiration for the visual quality and presentation of Party Wagon. Pay attention to:

Bold, confident visual presentation and attractive hero sections.
Strong colour combinations and expressive typography.
Beautiful product imagery and product presentation.
Clear visual hierarchy, intentional spacing, and balanced layouts.
Creative decorative details and promotional sections.
A polished, modern, lively, and memorable storefront.
The objective is to achieve a similarly engaging level of visual polish while preserving Party Wagon's own brand identity and approved Figma designs. Do not copy its branding, assets, wording, or page designs.

C. Drinks.ng — shopping flow and interaction inspiration
Website: https://drinks.ng/

Use Drinks.ng as a reference for the logic and usability of the shopping journey. Review relevant patterns such as:

Product and category discovery.
Category navigation and product organisation.
Search, filtering, and sorting.
Product selection and available options.
Adding products to the cart and updating quantities.
Cart review and progression towards checkout.
Clear feedback when a user interacts with the store.
Adapt only the patterns that make sense for Party Wagon's requirements and Ghanaian market. Do not assume every behaviour on Drinks.ng is required, and do not copy its brand, assets, wording, or exact interface.

Design priority when references differ
Use this order of priority:

Party Wagon requirements and approved Figma designs determine what to build and how Party Wagon's screens should look.
Drinks.ng provides interaction and shopping-flow inspiration where the requirements or Figma do not fully specify behaviour.
Drink Joy Rush provides visual inspiration where additional visual polish or presentation decisions are needed.
The final experience should feel distinctly like Party Wagon: colourful, celebratory, modern, easy to navigate, and visually polished.

Supplied design exports and approval status
The design package contains the following exports. The presence of a screen in the ZIP does not mean it has supervisor approval. Apply the approval status above.

HomePage.png — approved customer homepage reference.
Customer-facing screens — approved customer experience references; use the relevant customer screens for customer catalogue and shopping work.
Desktop - 1.png — customer shop/catalogue browsing layout reference. It contains placeholder product content; do not treat those placeholders as live product data.
Desktop - 2.png — product detail page layout reference.
Desktop - 3.png — Party Planner form/layout reference. Confirm that this specific screen is included in the supervisor-approved customer-facing set before treating it as final.
Desktop - 4.png — typography specifications.
Desktop - 5.png — official colour palette.
Desktop - 6.png — UI component reference, including primary, secondary and text buttons (default, hover and pressed states), dropdowns, quantity selector, checkboxes, radio buttons, and product-card treatments.
Dashboards/ — includes customer and other role-specific dashboard references. Customer-facing dashboard screens fall under the approved customer-facing set; Operations, Driver, Partner/Vendor, and other non-customer dashboards remain under supervisor review.
Party Wagon Logos/Logo/SVG/ and Party Wagon Logos/Logo/1x/ — approved logo and logomark variants. The exported filenames are generic asset numbers, so visually verify the correct colour/background variant before use. Prefer SVG for web use where the correct approved variant is available.
Party Wagon final brandbook.pdf — official brand identity guidance. Its logo, typography, colour, pattern, photography, and voice rules take precedence over generic design preferences.
JPG/ — supplied brand-use, merchandise/mockup, and social-media graphics. These are not automatically product catalogue photography; inspect and confirm intended use before placing any of them in product cards.
Keep design screenshots and the brand-book PDF in a non-public reference folder such as design-references/ at the repository root. Do not put reference screenshots or the full brand-book PDF in public/, because they are not website assets. Put only approved assets that the website actually needs to serve (for example, selected logo SVGs and approved images) in public/assets/.

HomePage.png — high-fidelity customer homepage reference. Use it for the overall storefront visual direction and the homepage sections shown in the design.
Desktop - 1.png — customer shop/catalogue browsing layout reference. It contains placeholder product content; do not treat those placeholders as live product data.
Desktop - 2.png — product detail page layout reference.
Desktop - 3.png — Party Planner form/layout reference.
Desktop - 4.png — approved typography scale reference.
Desktop - 5.png — approved colour palette reference.
Desktop - 6.png — approved UI component reference, including primary, secondary and text buttons (default, hover and pressed states), dropdowns, quantity selector, checkboxes, radio buttons, and product-card treatments.
Dashboards/ — customer dashboard, orders, party plans, operations, order review, driver, partner, and service-partner screen references. Use the relevant role-specific reference only when implementing that area.
Party Wagon Logos/Logo/SVG/ and Party Wagon Logos/Logo/1x/ — approved logo and logomark variants. The exported filenames are generic asset numbers, so visually verify the correct colour/background variant before use. Prefer SVG for web use where the correct approved variant is available.
Party Wagon final brandbook.pdf — official brand identity guidance. Its logo, typography, colour, pattern, photography, and voice rules take precedence over generic design preferences.
JPG/ — supplied brand-use, merchandise/mockup, and social-media graphics. These are not automatically product catalogue photography; inspect and confirm intended use before placing any of them in product cards.
Keep design screenshots and the brand-book PDF in a non-public reference folder such as design-references/ at the repository root. Do not put reference screenshots or the full brand-book PDF in public/, because they are not website assets. Put only approved assets that the website actually needs to serve (for example, selected logo SVGs and approved images) in public/assets/.

Typography pairing and usage — from the official brand book
The brand book's typography guidance (pages 17–18) defines a deliberate contrast between display headlines and readable supporting text:

Headlines: Oswald only. Headlines are generally 3–10 words, positioned at the top of a layout or alongside artwork. They should be visually dominant and larger than the other text in the composition. The examples use Oswald in uppercase display treatments.
Subheaders and longer copy: Outfit. Use Outfit Regular for supporting copy, descriptions, paragraphs, and other longer text so it remains legible beside the condensed Oswald headline.
Functional UI text: Use Outfit for navigation, labels, buttons, form fields, product descriptions, helper text, and other interface copy. Use the relevant approved Outfit weight (for example, SemiBold for button text where the Figma type sheet specifies it).
Decorative type: Obloquy Solid BRK is decorative only; do not use it for normal headlines, paragraphs, or functional controls unless a specific approved design explicitly calls for it.
How to combine the typefaces
Establish one clear Oswald headline as the visual anchor of a section or page.
Pair it with smaller Outfit supporting text; do not set long paragraphs in Oswald.
Keep the hierarchy obvious: Oswald carries the short, bold message; Outfit explains, describes, or guides the user.
Use uppercase Oswald where the approved Figma composition shows it, but do not force every text element into uppercase.
Avoid using Oswald and Outfit interchangeably within the same role. Do not use Oswald for body copy simply to make the interface look more branded.
Preserve the supplied Figma hierarchy and responsive scale. On narrow screens, reduce sizes and adjust wrapping while retaining the same typeface roles and contrast.
The brand book's page 18 specimen visually demonstrates this pairing: a large Oswald headline (for example, “HEADERS IN OSWALD” / “READY SET ENJOY!”) sits alongside smaller Outfit Regular supporting copy. Follow this relationship rather than treating both fonts as equal display fonts.

The supplied Figma typography sheet specifies:

H1 — Oswald Bold, 56px
H2 — Oswald Bold, 48px
H3 — Oswald SemiBold, 40px
H4 — Oswald SemiBold, 36px
Body — Outfit Regular, 32px
Body Small — Outfit Regular, 28px
Captions — Outfit Regular, 24px
Buttons — Outfit SemiBold, 24px
Use these as the approved reference values for the Figma scale. Apply responsive sizing where needed to fit the actual screen and component context while preserving the hierarchy. Do not force desktop display sizes onto mobile layouts.

The supplied ZIP contains Oswald family files and an Obloquy font file, but no Outfit font file was found. Outfit is still the required body/UI typeface. Before implementing typography, check whether Outfit has been provided separately or is available through the project's approved font-loading approach. Do not silently replace Outfit with Oswald or another font; flag the missing font to the human developer.

Approved UI component reference from Desktop - 6.png
Use the supplied component sheet as the baseline for component appearance and interaction states. It shows primary, secondary, and text buttons with default, hover, and pressed states; category dropdowns; quantity controls; checkboxes; radio buttons; and product cards with product imagery, product name, price, stock indication, and Add to Cart action. Match the approved appearance while making controls responsive, accessible, and functional. Do not assume the example merchandise or example product details are actual catalogue inventory.

3. Technology Stack
   Use the stack already configured in this repository:

Next.js with the App Router.
React.
TypeScript.
Tailwind CSS.
Lucide React for interface icons.
The native Fetch API for backend communication unless the project already establishes another approach.
Do not change framework versions, replace core tooling, or add dependencies without a clear need and the human developer's approval.

4. Repository and Backend Boundaries
   The frontend and backend are maintained in separate GitHub repositories. The backend is a separate Express.js 5, TypeScript, Prisma, and PostgreSQL project.

Work only inside the frontend repository unless explicitly instructed otherwise.
Do not modify backend files, schema, configuration, or migrations.
The backend folder may be visible in the broader Cursor workspace for reference; its presence does not make it part of this frontend repository.
Do not stage, commit, or push files from the backend or any neighbouring project.
Never expose credentials, private keys, tokens, or secrets in frontend code or commits.
Variables prefixed with NEXT*PUBLIC* are exposed to the browser. Never put secrets in them. 5. Backend API Integration Rules
The backend is developed separately, so its actual implementation and agreed API contract must be checked before integration.

Never invent API endpoints, HTTP methods, request payloads, response shapes, query parameters, or authentication rules.
Inspect the backend routes, controllers, services, validation schemas, documentation, or a contract supplied by the backend developer before calling an endpoint.
Confirm unclear or missing API details with the human developer/backend developer.
Keep API calls in a dedicated, reusable layer rather than scattering URLs and fetch logic across UI components.
Use TypeScript types that match the confirmed API contract.
Handle loading, empty, success, and error states.
Keep temporary mock data clearly separated from real API logic. Do not present mock data as live backend data.
Do not silently hide API errors or fabricate successful responses. 6. Party Wagon Brand Guidelines
Treat the official Party Wagon brand book and supplied Figma design system as authoritative. Apply the rules below whenever creating UI, components, mockups, illustrations, or customer-facing copy. If a detailed brand-book rule or approved Figma component conflicts with a generic design preference, follow the brand book/Figma and flag any genuine ambiguity.

Official colour palette
Use this strict palette for brand UI and design work:

Lemon Twist: #FFC200
Radiant Rose: #D52572
Lilac Luster: #6D00FF
Midnight Party: #331038
Blue Lagoon: #19C8BF
Offwhite: #EDD1DF
White (Lights): #FFFFFF
Use colours consistently and prefer existing design tokens or CSS variables when available. Do not introduce unrelated colours as additional brand colours. For functional states such as errors, warnings, and success, first check the approved Figma system; if it does not define them, use accessible, restrained treatments that do not alter the core brand palette unnecessarily. Always maintain readable contrast.

Typography and hierarchy
Oswald — use exclusively for headlines. Headlines should generally be 3–10 words and appear as the primary display text at the top of a layout or section.
Outfit — use for subheaders, subcopy, paragraphs, navigation, buttons, forms, labels, and other longer or functional text to maximise legibility.
Obloquy Solid BRK — decorative use only, where appropriate and supported by supplied brand assets; do not use it for body copy or functional UI.
Follow font sizes, weights, line heights, and hierarchy defined in the Party Wagon Figma files. Do not substitute fonts or invent a new type scale without approval.

Brand voice and customer-facing copy
Party Wagon's language should feel like a natural, confident blend of English and Ghanaian Pidgin. Keep it energetic, fun, conversational, friendly, and approachable—like a reliable friend who knows how to get the party sorted. The brand does not take itself too seriously, but instructions, prices, delivery information, policies, and checkout details must remain clear and unambiguous.

Use short, memorable, lively wording where appropriate. Brand-language examples include:

Prefer: “Where the party dey, we dey!” Avoid stiff, generic reassurance such as “You can always count on us!”
Prefer: “What be the vibe?” over “What are your plans for the night?”
Prefer: “The plug for all your party needs” over a generic description such as “We have everything you need for a great time.”
Prefer: “1-Click Enjoyment” over mechanical wording such as “Click to access our services.”
Prefer: “Ready, Set, Enjoy!” over formal phrasing such as “Prepare for an enjoyable time!”
Prefer: “We'll bring the party to you” over long corporate statements about providing an unforgettable party.
These are tone references, not mandatory copy to repeat everywhere. Use Pidgin naturally and in context; do not force it into every sentence or sacrifice clarity. Avoid overly formal, corporate, robotic, generic, or exaggerated wording. Never use playful language to obscure important transactional information.

Logo usage restrictions
Use only approved Party Wagon logo assets and supplied logo variants. Never:

Stretch, squash, distort, flip, or rotate a logo.
Add drop shadows, outlines, strokes, or effects.
Create unofficial outline versions or alter the logo artwork.
Apply gradients to the logo.
Place a full-colour logo on a low-contrast or visually busy background.
Preserve the logo's proportions, intended colours, clear space, and legibility. When the correct logo variant or background treatment is unclear, inspect the brand book/assets or ask the human developer rather than improvising.

Pattern and graphic system
The brand pattern system uses unconventional, zoomed-in geometric forms derived from the Party Wagon logomark. The guiding brand-book principle is: “When in doubt, just zoom in.” Use supplied pattern assets or approved logomark geometry. Do not invent unrelated decorative patterns or redraw the logomark in a way that changes its identity. Patterns should support the content and not interfere with text readability, product images, or controls.

Photography and imagery
Photography should balance vibrant, high-energy colours with soft nude tones to create warmth, allure, and refined sophistication. Imagery should feel lively and inviting while remaining polished and consistent with the brand.

Prioritise approved brand photography, product images, and supplied creative assets.
Choose imagery that makes party food, drinks, gatherings, and the product offering look appealing and authentic to the intended market.
Avoid unrelated stock imagery, inconsistent visual treatments, or visuals that clash with the brand's balance of energy and refinement.
Do not distort product or brand assets.
Overall brand application
The digital experience should combine fun and vibrancy with ease, dependability, and clarity. Visual energy must never come at the expense of navigation, accessibility, product comprehension, or checkout usability. Keep Party Wagon recognisable and consistent across all screens.

7. Current Feature: Customer Catalogue Browsing
   Build the customer catalogue according to the supplied Figma designs and the confirmed backend capabilities.

The experience may include the following, where supported by the requirements and API:

Browsing published products.
Browsing and navigating product categories.
Searching for products.
Filtering and sorting product results.
Product cards with appropriate product imagery and information.
Product detail navigation or views.
Product variants, pack sizes, or options.
Accurate product pricing.
Product availability or stock messaging.
Adding products to the cart and receiving clear interaction feedback.
Do not assume that every field or capability exists in the backend. Verify product data, pricing, variants, images, publication status, and stock/availability rules before integrating them. Do not invent prices, stock levels, product options, or business rules.

8. Frontend Architecture and Component Design
   Before creating or changing files:

Inspect the existing project structure and relevant implementation.
Follow established naming conventions and patterns.
Reuse existing components, hooks, utilities, and styles where appropriate.
Keep components modular, focused, and reusable.
Separate presentation components, API logic, types, and utilities in a way that fits the existing structure.
Avoid putting the entire catalogue experience in one large component.
Avoid duplicate components, unnecessary abstractions, and unnecessary folders.
Do not reorganise the whole project to implement a focused feature.
Do not assume a suggested folder structure exists. Inspect the repository first and extend its current conventions.

9. UI, Responsiveness, and Accessibility
   Implement the supplied Figma designs accurately before adding optional visual enhancements.
   Aim for a polished, intentional interface rather than a generic starter-template appearance.
   Support desktop, tablet, and mobile layouts, following the intended behaviour in Figma.
   Use responsive Tailwind CSS utilities and avoid fixed layouts that break at smaller widths.
   Maintain consistent spacing, typography, colours, alignment, and component states.
   Use Lucide React for interface icons where appropriate.
   Use semantic HTML and accessible labels, controls, and focus states.
   Ensure interactive elements work with keyboard and touch input.
   Provide appropriate loading, empty, error, and disabled states where relevant.
   Use supplied brand assets and product images when available. Do not substitute unrelated imagery without checking first.
10. Coding Standards
    Use TypeScript and meaningful, accurate type definitions.
    Avoid any unless there is a clearly justified reason.
    Keep components and functions focused and readable.
    Prefer reusable components over duplicated code, but do not over-engineer.
    Use Client Components only when client-side state, event handling, or browser functionality is required.
    Follow the current Next.js documentation and project conventions, including the generated Next.js agent guidance at the top of this file.
    Avoid unnecessary dependencies and configuration changes.
    Do not remove existing functionality or overwrite user work without approval.
    Do not make unrelated changes while implementing a feature.
11. Cursor Agent Workflow
    For each task:

Restate the requested outcome briefly and inspect the relevant existing files.
Check the applicable Figma screen and requirements before designing or coding.
Check the backend contract before implementing API integration.
Identify the files that need to change and give a brief implementation approach.
Implement only the requested scope, reusing existing patterns where possible.
Test the relevant interactions and responsive layouts.
Run the available lint, type-check, or build commands when appropriate.
Report what changed, which files were affected, what was tested, and any blockers or assumptions.
Do not claim that a feature works unless it has been tested. Clearly distinguish completed work from mock behaviour or unverified integration.

12. Git and Collaboration Rules
    The frontend repository uses these branches:

main — stable, approved code.
dev — shared integration and testing branch; the default branch on GitHub.
feature/\* — focused feature branches created from dev.
For the current catalogue task, the working branch is feature/catalogue-browsing.

Do not switch branches, merge, rebase, force-push, or delete branches unless the human developer asks.
Do not commit or push unless explicitly asked.
Keep commits focused and descriptive when asked to create them.
Never include .env files, secrets, backend files, or unrelated project files in commits. 13. Developer Collaboration Preferences
The human developer is responsible for the Party Wagon frontend and is using Cursor as the IDE and AI coding assistant.

Explain important implementation decisions in clear, direct language.
Work step by step and avoid overwhelming the developer with large unrelated changes.
Prefer practical instructions and exact file paths or commands when guidance is needed.
Do not assume the developer has approved a redesign, dependency, architectural change, or destructive operation.
Ask before taking actions that could delete, overwrite, or expose data.
Preserve the existing project structure and the developer's work unless there is a clear, approved reason to change it.
