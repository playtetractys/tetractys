# Tetractys

## Brainstorming

You start the game on Earth or Mars and each choice gives you different starting advantages. You get 10 propmt categories

1. Overall Strategy (developer role in the AI) (goes into every AI prompt so no extra charge for credits)
1. Military Strategy (uses AI credits)

   - AI chooses whether to attack, retreat, surrender, accept surrender, etc.

1. Human Dimplomacy (uses AI credits)
1. Alien Diplomacy (uses AI credits)
1. Resource gathering strategy (no AI credits)
1. Exploration goals or directions which uses fuel (e.g. in the direction of the center of the galaxy or toward the rim) (no AI credits)
1. Research technology (uses AI credits)

If you reach the center of the galaxy, you get to create your own galaxy.

Space travel scale system? Probalby in lightyears. The scale will be in fuel or tile count which will make it easy to determine how much fuel you need to spend to get to different solar systems.

Each solar system will have a random number of planets. Of those planets a random number will be inhabitable but always at least one. Even the uninhabitable planets will have resources you can mine. No cost to go between planets in the same star system to make it easy to develop the star system.

STORY MODE UI: The UI will have a strong story mode element where the screen is covered by a combination of images, audio, and text that tell a story. There will also be a timeline for any planet that you're on that you can explore. The sci-fi behind this is universal memory stored in quantum fields that AI is able to read from and write to.

MAP MODE UI: 2D map of the galaxy where you can see all stars but only planets of star systems you've been to. When you visit a star system, all planets and resources (e.g. asteroid belts) are revealed automatically. Use hex tiles to connect the areas of the map together. There can only be one star system per tile. That star system can have multiple stars. All ships in a solar system harvest solar radiation for energy and solar systems with multiple stars provide double the energy. Your fleets lose energy as they move between solar systems and gain energy in solar systems.

PROMPT MODE UI: Paralax with the image of your ship at the top (you can cutomize your image by uploading or generating) and it moves into the background as your console comes up.

INTERACTION MODE UI: When you're watching an AI interaction, it will be a log-like interface where you can watch the AI bots talk to each other and take actions.

BATTLE MODE ACTIONS:

1. attack - AI chooses to attach and which attacks to use
1. retreat
1. surrender
1. accept surrender

RESEARCH SYSTEM PARAMS:

1. Movement speed
1. Attack damage
1. Energy costs

Generate an image of the technology along with the text and parameters.

```json
{
  "imageUrl": "https://....",
  "prompt": "research space whales for interstellar travel",
  "response": "🔬 Research Discovery: Gravionaut Symbiosis – Harnessing Space Whales for Interstellar Travel After decades of deep-space tracking and cryptobiological analysis, scientists have successfully decoded the gravitational harmonics emitted by space whales—titanic, sentient lifeforms that naturally navigate between star systems. By developing a neural-symbiotic interface called the Gravionaut Node, researchers enabled limited communication and eventual co-piloting with these creatures. The space whales generate localized spacetime distortions through organic graviton manipulation, effectively allowing them (and now partnered vessels) to \"glide\" through folded space without traditional propulsion. In-game, unlocking Gravionaut Symbiosis enables a new class of bio-organic ships that do not consume fuel for interstellar jumps, drastically reducing upkeep costs and opening previously unreachable sectors. It also adds a new affinity mechanic where players must cultivate trust with whale colonies via empathy tech and resource offerings, affecting diplomacy, navigation precision, and long-distance travel cooldowns.",
  "params": {
    "travelSpeed": 10,
    "attackDamage": 40,
    "energyCost": -10
  }
}
```

What happens if you run into another fleet in space? Nothing for now. Maybe later, you can allocate optional credits for interacting with fleets you run into in empty tiles.

You can only interact with other fleets that are in the same solar system as you.

FUTURE PHASE: Allow creative users to create and monetize their own content. Maybe stories or items, or whatevs

If you make it to the center of the galaxy, you gain access to the admin panel for your galaxy so you can create your own game mechanics.

## Story

What if the AI revolution creates the technology to enable every human on Earth to be able to explore the galaxy, mine it for resources, and terraform planets? So, in the game you control a fleet of AI controlled ships and robots. Instead of controlling every action your army takes, you update your instructions (AI prompts) every day and your AI fleet (which can be spread all across the galaxy) uses those instructions to take actions for you.

We found that, for AI to be optimally effective, there needs to be a balance between iteration and limitation. Inspired by the Optimal Stopping algorithm AI developed for itself a system of structuring prompts into 10 categories called the tetractys. AI then iterates over these 10 prompts over the course of 24 hours to create the ideal balance between amount of input, time spent processing, and
