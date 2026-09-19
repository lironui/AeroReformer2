window.PROJECT_CASES = [
  {
    "id": "test_003522",
    "group": "success",
    "title": "Road overpass",
    "phrase": "The overpass is seen extending from the central portion of the image to the right edge.",
    "speech": "VoiceAeroRef · synthesized speech",
    "scores": {
      "swin": 0.9577722655327191,
      "resnet": 0.9509391115106212,
      "lscf": 0.3891390916848393
    },
    "metric": "Paper IoU at native mask resolution.",
    "base": "assets/examples/success-test_003522",
    "duration": 5.18,
    "width": 512,
    "height": 512
  },
  {
    "id": "test_006574",
    "group": "success",
    "title": "Storage tanks",
    "phrase": "The storage tank positioned in the upper right part of the image.",
    "speech": "VoiceAeroRef · synthesized speech",
    "scores": {
      "swin": 0.9479668529581807,
      "resnet": 0.9380189225719251,
      "lscf": 0.19760247486465585
    },
    "metric": "Paper IoU at native mask resolution.",
    "base": "assets/examples/success-test_006574",
    "duration": 4.75,
    "width": 512,
    "height": 512
  },
  {
    "id": "test_014110",
    "group": "success",
    "title": "Parked aircraft",
    "phrase": "The plane located at the bottom row of the group and furthest to the right.",
    "speech": "VoiceAeroRef · synthesized speech",
    "scores": {
      "swin": 0.8880965441579813,
      "resnet": 0.9106696304529036,
      "lscf": 0.0
    },
    "metric": "Paper IoU at native mask resolution.",
    "base": "assets/examples/success-test_014110",
    "duration": 4.44,
    "width": 512,
    "height": 512
  },
  {
    "id": "test_003951",
    "group": "success",
    "title": "Harbor vessel",
    "phrase": "The ship located at the centre of the image.",
    "speech": "VoiceAeroRef · synthesized speech",
    "scores": {
      "swin": 0.8981164383561644,
      "resnet": 0.8607681755829903,
      "lscf": 0.49308638843080044
    },
    "metric": "Paper IoU at native mask resolution.",
    "base": "assets/examples/success-test_003951",
    "duration": 3.65,
    "width": 512,
    "height": 512
  },
  {
    "id": "test_016123",
    "group": "success",
    "title": "Parked vehicles",
    "phrase": "The smaller vehicle is located towards the central part of the image.",
    "speech": "VoiceAeroRef · synthesized speech",
    "scores": {
      "swin": 0.9728215186326702,
      "resnet": 0.9693044212897776,
      "lscf": 0.467704492694251
    },
    "metric": "Paper IoU at native mask resolution.",
    "base": "assets/examples/success-test_016123",
    "duration": 3.98,
    "width": 512,
    "height": 512
  },
  {
    "id": "test_008964",
    "group": "success",
    "title": "Soccer field",
    "phrase": "The soccer-ball field has noticeable white boundary lines and goals, and is situated near the bottom-middle of the image.",
    "speech": "VoiceAeroRef · synthesized speech",
    "scores": {
      "swin": 0.8774231447033484,
      "resnet": 0.8408792034566973,
      "lscf": 0.1478996800495407
    },
    "metric": "Paper IoU at native mask resolution.",
    "base": "assets/examples/success-test_008964",
    "duration": 7.13,
    "width": 512,
    "height": 512
  },
  {
    "id": "test_003753",
    "group": "failure",
    "title": "Tennis court · wrong target",
    "phrase": "The tennis court in the upper left section of the image with the adjacent walkway to its right and bottom edges.",
    "speech": "VoiceAeroRef · synthesized speech",
    "scores": {
      "swin": 0.024429833007785635,
      "resnet": 0.2913026965438663,
      "lscf": 0.0
    },
    "metric": "Paper IoU at native mask resolution.",
    "base": "assets/examples/failure-test_003753",
    "duration": 6.1,
    "width": 512,
    "height": 512
  },
  {
    "id": "test_001954",
    "group": "failure",
    "title": "Service area · wrong target",
    "phrase": "The expressway service area situated closer to the center of the image.",
    "speech": "VoiceAeroRef · synthesized speech",
    "scores": {
      "swin": 0.006328762560373064,
      "resnet": 0.005532722099272842,
      "lscf": 0.0015054057752839742
    },
    "metric": "Paper IoU at native mask resolution.",
    "base": "assets/examples/failure-test_001954",
    "duration": 4.13,
    "width": 512,
    "height": 512
  },
  {
    "id": "test_010299",
    "group": "failure",
    "title": "Ship · incomplete coverage",
    "phrase": "The ship located towards the top of the image.",
    "speech": "VoiceAeroRef · synthesized speech",
    "scores": {
      "swin": 0.30222361415596616,
      "resnet": 0.36955840901973064,
      "lscf": 0.2278837136605189
    },
    "metric": "Paper IoU at native mask resolution.",
    "base": "assets/examples/failure-test_010299",
    "duration": 3.29,
    "width": 512,
    "height": 512
  },
  {
    "id": "test_001377",
    "group": "failure",
    "title": "Stadium · incomplete coverage",
    "phrase": "The prominent stadium located in the bottom half of the image and is rectangular in shape.",
    "speech": "VoiceAeroRef · synthesized speech",
    "scores": {
      "swin": 0.4253624081146565,
      "resnet": 0.006382195311541137,
      "lscf": 0.1345908848066412
    },
    "metric": "Paper IoU at native mask resolution.",
    "base": "assets/examples/failure-test_001377",
    "duration": 5.54,
    "width": 512,
    "height": 512
  },
  {
    "id": "test_009700",
    "group": "failure",
    "title": "Courts · extra foreground",
    "phrase": "The tennis court positioned at the bottom-right part of the image.",
    "speech": "VoiceAeroRef · synthesized speech",
    "scores": {
      "swin": 0.4117855605358454,
      "resnet": 0.5589486020425247,
      "lscf": 0.09195947147004799
    },
    "metric": "Paper IoU at native mask resolution.",
    "base": "assets/examples/failure-test_009700",
    "duration": 4.06,
    "width": 512,
    "height": 512
  },
  {
    "id": "test_008086",
    "group": "failure",
    "title": "Bridge · extra foreground",
    "phrase": "The bridge is at the middle part of the image.",
    "speech": "VoiceAeroRef · synthesized speech",
    "scores": {
      "swin": 0.5375122081150671,
      "resnet": 0.7121628371628371,
      "lscf": 0.37054998346743084
    },
    "metric": "Paper IoU at native mask resolution.",
    "base": "assets/examples/failure-test_008086",
    "duration": 3.46,
    "width": 512,
    "height": 512
  },
  {
    "id": "aeriald_P2239_patch_006038_o62846",
    "group": "external",
    "title": "Parked aircraft",
    "phrase": "the lone white passenger plane above and slightly right of the row of smaller planes on the upper runway",
    "speech": "Aerial-D · Qwen3-TTS speech",
    "scores": {
      "swin": 0.7129337787628174,
      "resnet": 0.7903226017951965,
      "lscf": 0.682634711265564
    },
    "metric": "Paper IoU evaluated at 352 × 352; exported 800 × 800 masks are used for display.",
    "base": "assets/examples/external-aeriald_P2239_patch_006038_o62846",
    "duration": 6.8,
    "width": 480,
    "height": 480
  },
  {
    "id": "aeriald_P2337_patch_006162_o69984",
    "group": "external",
    "title": "Storage tank",
    "phrase": "the storage tank in the top right just below and to the right of the larger tank",
    "speech": "Aerial-D · Qwen3-TTS speech",
    "scores": {
      "swin": 0.9128544330596924,
      "resnet": 0.9273169636726379,
      "lscf": 0.7335687279701233
    },
    "metric": "Paper IoU evaluated at 352 × 352; exported 800 × 800 masks are used for display.",
    "base": "assets/examples/external-aeriald_P2337_patch_006162_o69984",
    "duration": 4.96,
    "width": 480,
    "height": 480
  },
  {
    "id": "aeriald_P1066_patch_001751_o25857",
    "group": "external",
    "title": "Ship at sea",
    "phrase": "the lone ship with bright lights moving across the water in the center right",
    "speech": "Aerial-D · Qwen3-TTS speech",
    "scores": {
      "swin": 0.8315591812133789,
      "resnet": 0.7482993006706238,
      "lscf": 0.7662337422370911
    },
    "metric": "Paper IoU evaluated at 352 × 352; exported 800 × 800 masks are used for display.",
    "base": "assets/examples/external-aeriald_P1066_patch_001751_o25857",
    "duration": 3.68,
    "width": 480,
    "height": 480
  },
  {
    "id": "aeriald_P0019_patch_000129_o511",
    "group": "external",
    "title": "Harbor structure",
    "phrase": "the harbor with the dark opening on the right just right of the other storage structures",
    "speech": "Aerial-D · Qwen3-TTS speech",
    "scores": {
      "swin": 0.7681029438972473,
      "resnet": 0.6683616042137146,
      "lscf": 0.5160786509513855
    },
    "metric": "Paper IoU evaluated at 352 × 352; exported 800 × 800 masks are used for display.",
    "base": "assets/examples/external-aeriald_P0019_patch_000129_o511",
    "duration": 5.04,
    "width": 480,
    "height": 480
  },
  {
    "id": "aeriald_P2241_patch_006041_o62852",
    "group": "external",
    "title": "Baseball diamond",
    "phrase": "the orange baseball field in the upper middle just below and to the left of the big white truck",
    "speech": "Aerial-D · Qwen3-TTS speech",
    "scores": {
      "swin": 0.9268348813056946,
      "resnet": 0.8530762195587158,
      "lscf": 0.7390938401222229
    },
    "metric": "Paper IoU evaluated at 352 × 352; exported 800 × 800 masks are used for display.",
    "base": "assets/examples/external-aeriald_P2241_patch_006041_o62852",
    "duration": 9.44,
    "width": 480,
    "height": 480
  },
  {
    "id": "aeriald_P0499_patch_000697_o9961",
    "group": "external",
    "title": "Tennis court",
    "phrase": "the darkest tennis court on the right in the upper right corner sitting below and to the right of a green soccer field",
    "speech": "Aerial-D · Qwen3-TTS speech",
    "scores": {
      "swin": 0.9473629593849182,
      "resnet": 0.9396792650222778,
      "lscf": 0.8274116516113281
    },
    "metric": "Paper IoU evaluated at 352 × 352; exported 800 × 800 masks are used for display.",
    "base": "assets/examples/external-aeriald_P0499_patch_000697_o9961",
    "duration": 7.36,
    "width": 480,
    "height": 480
  },
  {
    "id": "aeriald_P0161_patch_000317_o6135",
    "group": "human",
    "title": "Parked aircraft",
    "phrase": "the brightest plane at the top of the row",
    "speech": "Aerial-D · human-recorded speech",
    "scores": {
      "swin": 0.6759721040725708,
      "resnet": 0.6863824129104614,
      "lscf": 0.0
    },
    "metric": "Paper IoU evaluated at 352 × 352; exported 800 × 800 masks are used for display.",
    "base": "assets/examples/human-aeriald_P0161_patch_000317_o6135",
    "duration": 3.31,
    "width": 480,
    "height": 480
  },
  {
    "id": "aeriald_P1242_patch_002509_o32042",
    "group": "human",
    "title": "Storage tank",
    "phrase": "the bright tank furthest to the left on the bottom center cluster",
    "speech": "Aerial-D · human-recorded speech",
    "scores": {
      "swin": 0.8406593203544617,
      "resnet": 0.8855586051940918,
      "lscf": 0.0
    },
    "metric": "Paper IoU evaluated at 352 × 352; exported 800 × 800 masks are used for display.",
    "base": "assets/examples/human-aeriald_P1242_patch_002509_o32042",
    "duration": 5.74,
    "width": 480,
    "height": 480
  },
  {
    "id": "aeriald_P1583_patch_004591_o46074",
    "group": "human",
    "title": "Baseball diamond",
    "phrase": "the darkest baseball field on the right side of a cluster of three diamonds near the bottom left",
    "speech": "Aerial-D · human-recorded speech",
    "scores": {
      "swin": 0.5079872012138367,
      "resnet": 0.7932659983634949,
      "lscf": 0.4527449607849121
    },
    "metric": "Paper IoU evaluated at 352 × 352; exported 800 × 800 masks are used for display.",
    "base": "assets/examples/human-aeriald_P1583_patch_004591_o46074",
    "duration": 6.76,
    "width": 480,
    "height": 480
  },
  {
    "id": "aeriald_P0964_patch_001344_o23453",
    "group": "human",
    "title": "T-shaped pier",
    "phrase": "the lone pier that stretches into the water with a T shape",
    "speech": "Aerial-D · human-recorded speech",
    "scores": {
      "swin": 0.6162844300270081,
      "resnet": 0.6091713309288025,
      "lscf": 0.5175377726554871
    },
    "metric": "Paper IoU evaluated at 352 × 352; exported 800 × 800 masks are used for display.",
    "base": "assets/examples/human-aeriald_P0964_patch_001344_o23453",
    "duration": 4.37,
    "width": 480,
    "height": 480
  },
  {
    "id": "aeriald_P2721_patch_007601_o105362",
    "group": "human",
    "title": "Track field",
    "phrase": "the darkest track field on the right in the middle right just below the soccer field",
    "speech": "Aerial-D · human-recorded speech",
    "scores": {
      "swin": 0.643216073513031,
      "resnet": 0.629539966583252,
      "lscf": 0.5051546096801758
    },
    "metric": "Paper IoU evaluated at 352 × 352; exported 800 × 800 masks are used for display.",
    "base": "assets/examples/human-aeriald_P2721_patch_007601_o105362",
    "duration": 5.21,
    "width": 480,
    "height": 480
  },
  {
    "id": "aeriald_P0128_patch_000215_o1882",
    "group": "human",
    "title": "Ship: failure case",
    "phrase": "the little white ship in the center left just beneath the larger blue and white boat",
    "speech": "Aerial-D · human-recorded speech",
    "scores": {
      "swin": 0.16300782561302185,
      "resnet": 0.0,
      "lscf": 0.15496650338172913
    },
    "metric": "Paper IoU evaluated at 352 × 352; exported 800 × 800 masks are used for display.",
    "base": "assets/examples/human-aeriald_P0128_patch_000215_o1882",
    "duration": 5.67,
    "width": 480,
    "height": 480
  }
];
