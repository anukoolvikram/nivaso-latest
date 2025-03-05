import { Card, CardHeader, CardBody, Typography } from "@material-tailwind/react";
import { CheckCircleIcon } from "@heroicons/react/24/solid";
import { motion } from "framer-motion";

const features = [
  {
    title: "📜 Legal Document Management",
    img: "https://images.unsplash.com/photo-1562564055-71e051d33c19?q=80&w=2070&auto=format&fit=crop",
    features: [
      "Securely store, access, and share society documents",
      "Pre-built government-compliant templates",
    ],
  },
  {
    title: "📢 Community Engagement",
    img: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?q=80&w=2072&auto=format&fit=crop",
    features: [
      "Send notices between committee members and residents",
      "AI-moderated community blog for discussions",
    ],
  },
  {
    title: "🏠 Amenity & Facility Booking",
    img: "https://images.unsplash.com/photo-1469022563428-aa04fef9f5a2?q=80&w=2073&auto=format&fit=crop",
    features: [
      "Reserve community halls, sports grounds, common spaces",
      "Manage usage policies and approvals easily",
    ],
  },
  {
    title: "🔒 Security & Gate Management",
    img: "https://images.unsplash.com/photo-1496368077930-c1e31b4e5b44?q=80&w=2070&auto=format&fit=crop",
    features: [
      "Approve entry for domestic staff or personnel",
      "Digital parking management for fair space allocation",
    ],
  },
  {
    title: "💰 Maintenance & Payment Track",
    img: "https://images.unsplash.com/photo-1593182440959-9d5165b29b59?q=80&w=2071&auto=format&fit=crop",
    features: [
      "Simplified dues collection and tracking of payments",
      "Secure integration with payment gateways",
    ],
  },
  {
    title: "🛠 On-Demand Services",
    img: "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?q=80&w=2070&auto=format&fit=crop",
    features: [
      "Access legal experts, auditors, engineers, and technicians",
      "Hire security guards and maintenance teams",
    ],
  },
];

const Features = () => {
  return (
    <div className="mx-10 md:mx-20 mt-6">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="w-full text-center font-bold text-4xl bg-gray-100 text-gray-800 py-3 rounded-xl shadow-lg"
      >
        Key Features
      </motion.div>

      {/* Feature Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 place-items-center mt-6">
        {features.map((feature, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.2 }}
            whileHover={{ scale: 1.05 }}
          >
            <Card className="p-3 bg-gray-50 shadow-md rounded-lg transition-transform hover:shadow-lg">
              <CardHeader color="blue-gray" className="relative h-44 rounded-lg overflow-hidden">
                <img
                  src={feature.img}
                  alt="feature-image"
                  className="w-full h-full object-cover"
                />
              </CardHeader>
              <CardBody>
                <Typography variant="h5" className="mb-3 font-semibold text-gray-900">
                  {feature.title}
                </Typography>
                <Typography className="text-gray-700 text-sm">
                  <ul className="space-y-2">
                    {feature.features.map((item, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <CheckCircleIcon className="h-5 w-5 text-blue-600" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </Typography>
              </CardBody>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Features;
