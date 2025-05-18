const mongoose = require('mongoose');

const ProjectSchema = new mongoose.Schema(
  {
    // Step 0 – User identity
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    user_name: {
      type: String,
      required: true
    },

    // Step 1 – General Info
    project_name: {
      type: String,
      required: true,
      minlength: 3
    },
    project_industry: {
      type: String,
      required: true
    },
    min_investment: {
      type: Number,
      required: true
    },
    max_investment: {
      type: Number,
      required: true
    },
    networth: {
      type: Number,
      required: true
    },
    deal_type: {
      type: [String],
      required: true
    },
    project_location: {
      type: String,
      required: true
    },
    city: {
      type: String
    },
    state: {
      type: String
    },
    postal_code: {
      type: String,
      required: true
    },
    website_link: {
      type: String
    },
    project_stage: {
      type: String,
      required: true,
      enum: ['Seed', 'Launch', 'Growth']
    },

    // Step 2 – Description
    market_description: {
      type: String,
      required: false,
      minlength: 50
    },
    business_objectives: {
      type: String,
      required: false,
      minlength: 50
    },
    bussiness_highlights: {
      type: String
    },
    financial_status: {
      type: String
    },

    // Step 3 – Documents
    business_plan: {
      type: String
    },
    financial_statement: {
      type: String
    },
    exective_sunnary: {
      type: String
    },
    additional_document: {
      type: String
    },
    project_logo: {
      type: String
    },
    project_images: {
      type: [String],
      default: []
    },

    // Step 4 – Team
    team_overview: {
      type: String
    },
    team_members: {
      type: [
        {
          member_image: {
            type: String,
            required: [function () {
              // Access the project document to check if team_members exists
              const project = this instanceof mongoose.Document ? this : this.parent();
              // Check if the project is new (no existing team_members) or being created
              return !project.isNew && !project.team_members?.length;
            }, 'Member image is required for new projects'],
          },
          member_name: {
            type: String,
            required: [true, 'Member name is required'],
            trim: true,
          },
          linkedin_account: {
            type: String,
            required: [true, 'LinkedIn account is required'],
            trim: true,
            validate: {
              validator: function (v) {
                return /^https?:\/\/(www\.)?linkedin\.com\/.*$/.test(v);
              },
              message: 'Please enter a valid LinkedIn profile URL',
            },
          },
          member_position: {
            type: String,
            required: [true, 'Member position is required'],
            trim: true,
          },
          member_bio: {
            type: String,
            required: [true, 'Member bio is required'],
            trim: true,
          },
        },
      ],
      default: [],
    },

    // Final Status
    status: {
      type: String,
      enum: ['Draft', 'Approved', 'Rejected'],
      default: 'Draft'
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Project', ProjectSchema);