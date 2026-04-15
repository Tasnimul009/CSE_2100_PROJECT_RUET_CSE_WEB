export const RESEARCH_STATS = {
  researchAreas: 6,
  publications: 5,
  activeProjects: 4,
  facultyResearchers: 24,
}

export const RESEARCH_AREAS = [
  {
    _id: "1",
    code: "AI",
    name: "Artificial Intelligence and Machine Learning",
    description:
      "Deep learning, neural networks, computer vision, and natural language processing for real-world applications.",
    tags: ["Deep Learning", "NLP", "Computer Vision"],
    paperCount: 18,
  },
  {
    _id: "2",
    code: "SEC",
    name: "Cybersecurity and Network Security",
    description:
      "Intrusion detection systems, cryptographic protocols, vulnerability analysis, and secure distributed computing.",
    tags: ["Cryptography", "IDS", "Blockchain"],
    paperCount: 12,
  },
  {
    _id: "3",
    code: "BIO",
    name: "Biomedical Informatics",
    description:
      "AI-driven diagnostics, medical image analysis, disease prediction using ML, and health data analytics.",
    tags: ["Medical AI", "Image Analysis", "EHR"],
    paperCount: 9,
  },
  {
    _id: "4",
    code: "IOT",
    name: "IoT and Embedded Systems",
    description:
      "Smart sensor networks, edge computing, real-time systems, and energy-efficient embedded device design.",
    tags: ["Edge AI", "Sensors", "RTOS"],
    paperCount: 11,
  },
  {
    _id: "5",
    code: "GEN",
    name: "Bioinformatics and Computational Biology",
    description:
      "Genomic sequence analysis, protein structure prediction, and computational drug discovery pipelines.",
    tags: ["Genomics", "Protein Folding", "Drug Discovery"],
    paperCount: 7,
  },
  {
    _id: "6",
    code: "CLOUD",
    name: "Distributed Systems and Cloud Computing",
    description:
      "Scalable microservice architectures, container orchestration, serverless platforms, and fault-tolerant systems.",
    tags: ["Kubernetes", "Microservices", "Cloud"],
    paperCount: 8,
  },
]

export const PUBLICATIONS = [
  {
    _id: "1",
    title: "BanglaNet: A Transformer-Based Framework for Low-Resource Bangla NLP Tasks",
    authors: "Dr. Md. Ashraful Islam, Fahim Hossain, Nusrat Jahan",
    venue: "IEEE Transactions on Neural Networks and Learning Systems",
    year: 2024,
    type: "journal",
    rank: "Q1",
    citations: 14,
  },
  {
    _id: "2",
    title:
      "Federated Learning for Privacy-Preserving Medical Image Segmentation in Resource-Constrained Environments",
    authors: "Prof. Tanvir Ahmed, Raihan Kabir, Dr. Lubna Akter",
    venue: "CVPR 2024 - IEEE/CVF Conference on Computer Vision and Pattern Recognition",
    year: 2024,
    type: "conference",
    rank: "A*",
    citations: 31,
  },
  {
    _id: "3",
    title: "An Intrusion Detection System Using Hybrid CNN-LSTM Architecture on the NSL-KDD Dataset",
    authors: "Dr. Rezaul Karim, Md. Shafiqul Islam",
    venue: "Computers and Security, Elsevier",
    year: 2023,
    type: "journal",
    rank: "Q1",
    citations: 48,
  },
  {
    _id: "4",
    title: "EduBot: An AI-Driven Adaptive Learning Platform for Bangladeshi Secondary Education",
    authors: "Prof. Hasibul Hasan, Sadia Afrin, Arif Rahman",
    venue: "ACM CHI 2023 - Conference on Human Factors in Computing Systems",
    year: 2023,
    type: "conference",
    rank: "A*",
    citations: 22,
  },
  {
    _id: "5",
    title: "Lightweight Cryptographic Protocol for Secure IoT Communication in Smart Agriculture Systems",
    authors: "Dr. Nadia Islam, Imtiaz Hossain, Prof. Kamrul Hassan",
    venue: "Internet of Things Journal, IEEE",
    year: 2023,
    type: "journal",
    rank: "Q1",
    citations: 19,
  },
]

export const RESEARCH_PROJECTS = [
  {
    _id: "1",
    name: "BanglaMed: Clinical NLP for Bangla Electronic Health Records",
    description:
      "Developing transformer-based NLP models to extract structured clinical information from unstructured Bangla medical records at Rajshahi Medical College.",
    status: "active",
    pi: "Dr. Md. Ashraful Islam",
    funding: "ICT Ministry",
  },
  {
    _id: "2",
    name: "SmartKrishi: IoT-Powered Precision Agriculture Platform",
    description:
      "Low-cost sensor network and edge AI system for soil monitoring, crop disease detection, and automated irrigation for Bangladeshi farmers.",
    status: "active",
    pi: "Prof. Kamrul Hassan",
    funding: "BARC Grant",
  },
  {
    _id: "3",
    name: "CyberShield BD: National Intrusion Detection Framework",
    description:
      "Collaborative project with BTRC to build a real-time cyber threat intelligence and intrusion detection system for Bangladesh national network infrastructure.",
    status: "active",
    pi: "Dr. Rezaul Karim",
    funding: "BTRC / HEQEP",
  },
  {
    _id: "4",
    name: "EduBot: Adaptive AI Tutoring System for Rural Students",
    description:
      "AI-powered personalized tutoring platform for secondary students in rural Bangladesh, with offline support and Bangla speech interface.",
    status: "completed",
    pi: "Prof. Hasibul Hasan",
    funding: "A2i / UNDP",
  },
  {
    _id: "5",
    name: "GenoRUET: Computational Protein Structure Prediction",
    description:
      "Using deep learning and molecular dynamics to predict protein folding for endemic tropical disease targets in South Asia.",
    status: "active",
    pi: "Dr. Lubna Akter",
    funding: "UGC Grant",
  },
  {
    _id: "6",
    name: "CloudRUET: Federated Cloud Infrastructure for Academia",
    description:
      "Designed and deployed a federated private cloud for shared HPC resources across Rajshahi, Khulna, and Chittagong engineering universities.",
    status: "completed",
    pi: "Prof. Tanvir Ahmed",
    funding: "HEQEP / World Bank",
  },
]
