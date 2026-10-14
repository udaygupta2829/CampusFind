package com.campusfind.config;

import com.campusfind.entity.*;
import com.campusfind.repository.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.io.File;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Component
public class DataInitializer implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(DataInitializer.class);

    private final UserRepository userRepository;
    private final ItemReportRepository itemReportRepository;
    private final ItemImageRepository itemImageRepository;
    private final ClaimRepository claimRepository;
    private final MatchSuggestionRepository matchSuggestionRepository;
    private final ReturnRecordRepository returnRecordRepository;
    private final NotificationRepository notificationRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(
            UserRepository userRepository,
            ItemReportRepository itemReportRepository,
            ItemImageRepository itemImageRepository,
            ClaimRepository claimRepository,
            MatchSuggestionRepository matchSuggestionRepository,
            ReturnRecordRepository returnRecordRepository,
            NotificationRepository notificationRepository,
            PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.itemReportRepository = itemReportRepository;
        this.itemImageRepository = itemImageRepository;
        this.claimRepository = claimRepository;
        this.matchSuggestionRepository = matchSuggestionRepository;
        this.returnRecordRepository = returnRecordRepository;
        this.notificationRepository = notificationRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        // Ensure uploads directory exists
        File uploadFolder = new File("uploads");
        if (!uploadFolder.exists()) {
            boolean created = uploadFolder.mkdirs();
            if (created) {
                log.info("Created uploads/ directory");
            }
        }

        if (userRepository.count() > 0) {
            log.info("Database already contains data.");
            if (itemImageRepository.count() == 0) {
                log.info("Populating missing images for existing sample items...");
                List<ItemReport> allReports = itemReportRepository.findAll();
                for (ItemReport report : allReports) {
                    String imgName = "sample-airpods.jpg";
                    String name = report.getItemName().toLowerCase();
                    if (name.contains("backpack")) {
                        imgName = "sample-backpack.jpg";
                    } else if (name.contains("id card")) {
                        imgName = report.getType() == ItemType.FOUND ? "sample-idcard-found.jpg" : "sample-idcard.jpg";
                    } else if (name.contains("watch")) {
                        imgName = "sample-watch.jpg";
                    } else if (report.getType() == ItemType.FOUND) {
                        imgName = "sample-airpods-found.jpg";
                    }
                    itemImageRepository.save(ItemImage.builder()
                            .itemReport(report)
                            .imageUrl("/uploads/" + imgName)
                            .fileName(imgName)
                            .isPrimary(true)
                            .build());
                }
            }
            return;
        }

        log.info("Database empty. Seeding initial CampusFind sample data and demo accounts...");

        String encodedPassword = passwordEncoder.encode("password123");

        // 1. Users
        User admin = userRepository.save(User.builder()
                .fullName("Admin Officer Sharma")
                .email("admin@campus.edu")
                .password(encodedPassword)
                .phoneNumber("+91 9876543210")
                .collegeId("ADM-2024-001")
                .role(Role.ROLE_ADMIN)
                .build());

        User aarav = userRepository.save(User.builder()
                .fullName("Aarav Patel")
                .email("aarav.patel@campus.edu")
                .password(encodedPassword)
                .phoneNumber("+91 9811122233")
                .collegeId("21BCS10045")
                .role(Role.ROLE_STUDENT)
                .build());

        User sneha = userRepository.save(User.builder()
                .fullName("Sneha Reddy")
                .email("sneha.reddy@campus.edu")
                .password(encodedPassword)
                .phoneNumber("+91 9822233344")
                .collegeId("22BCS10892")
                .role(Role.ROLE_STUDENT)
                .build());

        User rohan = userRepository.save(User.builder()
                .fullName("Rohan Verma")
                .email("rohan.verma@campus.edu")
                .password(encodedPassword)
                .phoneNumber("+91 9833344455")
                .collegeId("20BME10012")
                .role(Role.ROLE_STUDENT)
                .build());

        // 2. Lost Item Reports
        ItemReport lostAirpods = itemReportRepository.save(ItemReport.builder()
                .user(aarav)
                .type(ItemType.LOST)
                .itemName("Apple AirPods Pro (2nd Gen)")
                .category("Electronics")
                .colour("White")
                .description("Lost inside the white MagSafe charging case near 2nd floor reading hall.")
                .uniqueMarks("Small Batman sticker on back of charging case")
                .location("Central Library, 2nd Floor")
                .eventDate(LocalDate.now().minusDays(3))
                .contactPreference("Email")
                .status(ItemStatus.POSSIBLE_MATCH)
                .build());

        ItemReport lostBackpack = itemReportRepository.save(ItemReport.builder()
                .user(sneha)
                .type(ItemType.LOST)
                .itemName("Blue Wildcraft Backpack")
                .category("Bags & Backpacks")
                .colour("Navy Blue")
                .description("Contains Engineering Physics textbook, scientific calculator (Casio 991EX), and class notebooks.")
                .uniqueMarks("Keychain with red metal guitar tag")
                .location("Block A Cafeteria")
                .eventDate(LocalDate.now().minusDays(2))
                .contactPreference("Phone")
                .status(ItemStatus.OPEN)
                .build());

        ItemReport lostIdCard = itemReportRepository.save(ItemReport.builder()
                .user(rohan)
                .type(ItemType.LOST)
                .itemName("Student ID Card & Metro Pass")
                .category("ID Cards / Documents")
                .colour("Silver / Blue")
                .description("Campus ID Card for Rohan Verma (20BME10012) in transparent hard lanyard.")
                .uniqueMarks("Yellow thread knotted at top of lanyard clip")
                .location("Sports Complex Ground")
                .eventDate(LocalDate.now().minusDays(4))
                .contactPreference("Campus Portal")
                .status(ItemStatus.CLAIM_REQUESTED)
                .build());

        // 3. Found Item Reports
        ItemReport foundAirpods = itemReportRepository.save(ItemReport.builder()
                .user(sneha)
                .type(ItemType.FOUND)
                .itemName("White Wireless Earbuds in Case")
                .category("Electronics")
                .colour("White")
                .description("Found Apple AirPods in charging case on reading desk row 4.")
                .location("Central Library, 2nd Floor")
                .eventDate(LocalDate.now().minusDays(3))
                .contactPreference("Campus Portal")
                .itemHeldAt("Admin Office")
                .status(ItemStatus.POSSIBLE_MATCH)
                .build());

        ItemReport foundIdCard = itemReportRepository.save(ItemReport.builder()
                .user(rohan)
                .type(ItemType.FOUND)
                .itemName("Campus Student ID Card")
                .category("ID Cards / Documents")
                .colour("Silver / Blue")
                .description("Student ID card with mechanical branch tag found near badminton court bench.")
                .location("Sports Complex Ground")
                .eventDate(LocalDate.now().minusDays(4))
                .contactPreference("Campus Portal")
                .itemHeldAt("Security Office")
                .status(ItemStatus.CLAIMED)
                .build());

        ItemReport foundWatch = itemReportRepository.save(ItemReport.builder()
                .user(aarav)
                .type(ItemType.FOUND)
                .itemName("Titan Metal Analog Watch")
                .category("Clothing & Accessories")
                .colour("Silver")
                .description("Found on the washroom counter near CS department labs.")
                .location("Block B, 3rd Floor")
                .eventDate(LocalDate.now().minusDays(1))
                .contactPreference("Campus Portal")
                .itemHeldAt("Security Office")
                .status(ItemStatus.OPEN)
                .build());

        // 4. Sample Images
        itemImageRepository.save(ItemImage.builder()
                .itemReport(lostAirpods)
                .imageUrl("/uploads/sample-airpods.jpg")
                .fileName("sample-airpods.jpg")
                .isPrimary(true)
                .build());

        itemImageRepository.save(ItemImage.builder()
                .itemReport(lostBackpack)
                .imageUrl("/uploads/sample-backpack.jpg")
                .fileName("sample-backpack.jpg")
                .isPrimary(true)
                .build());

        itemImageRepository.save(ItemImage.builder()
                .itemReport(foundAirpods)
                .imageUrl("/uploads/sample-airpods-found.jpg")
                .fileName("sample-airpods-found.jpg")
                .isPrimary(true)
                .build());

        itemImageRepository.save(ItemImage.builder()
                .itemReport(lostIdCard)
                .imageUrl("/uploads/sample-idcard.jpg")
                .fileName("sample-idcard.jpg")
                .isPrimary(true)
                .build());

        itemImageRepository.save(ItemImage.builder()
                .itemReport(foundIdCard)
                .imageUrl("/uploads/sample-idcard-found.jpg")
                .fileName("sample-idcard-found.jpg")
                .isPrimary(true)
                .build());

        itemImageRepository.save(ItemImage.builder()
                .itemReport(foundWatch)
                .imageUrl("/uploads/sample-watch.jpg")
                .fileName("sample-watch.jpg")
                .isPrimary(true)
                .build());

        // 5. Match Suggestions
        matchSuggestionRepository.save(MatchSuggestion.builder()
                .lostItem(lostAirpods)
                .foundItem(foundAirpods)
                .matchScore(92.5)
                .matchReason("Exact category match (Electronics), matching white colour, same location (Central Library 2nd Floor)")
                .status(MatchStatus.SUGGESTED)
                .build());

        matchSuggestionRepository.save(MatchSuggestion.builder()
                .lostItem(lostIdCard)
                .foundItem(foundIdCard)
                .matchScore(88.0)
                .matchReason("Exact category match (ID Cards / Documents), matching location (Sports Complex)")
                .status(MatchStatus.CONFIRMED_BY_ADMIN)
                .build());

        // 6. Claims
        Claim approvedClaim = claimRepository.save(Claim.builder()
                .foundItem(foundIdCard)
                .claimant(rohan)
                .claimDescription("This is my college ID card and metro smart pass that fell out of my gym bag.")
                .privateOwnershipProof("The back of the ID card has a handwritten parent phone number ending in 4455, and the metro card serial ends with 8812.")
                .status(ClaimStatus.APPROVED)
                .adminNotes("ID credentials verified against student portal database. Approved for pickup at Security Desk.")
                .verifiedBy(admin)
                .build());

        claimRepository.save(Claim.builder()
                .foundItem(foundAirpods)
                .claimant(aarav)
                .claimDescription("These are my AirPods Pro that I left on desk #14 while studying for midterms.")
                .privateOwnershipProof("Case has a small black bat logo sticker on the bottom rear hinge; right earbud has a tiny scratch on the stem.")
                .status(ClaimStatus.PENDING)
                .build());

        // 7. Return Record
        returnRecordRepository.save(ReturnRecord.builder()
                .claim(approvedClaim)
                .itemReport(foundIdCard)
                .receivedBy(rohan)
                .returnedBy(admin)
                .returnDate(LocalDateTime.now())
                .handoverLocation("Security Main Gate Office")
                .verificationMethod("Physical College ID & Signature Check")
                .remarks("Student signed the return register and physically demonstrated biometric match.")
                .build());

        // 8. Notifications
        notificationRepository.save(Notification.builder()
                .user(aarav)
                .title("Potential Match Found!")
                .message("A found item report matching your lost 'Apple AirPods Pro' was posted at Central Library.")
                .type("MATCH_FOUND")
                .isRead(false)
                .relatedItemId(foundAirpods.getId())
                .build());

        notificationRepository.save(Notification.builder()
                .user(rohan)
                .title("Claim Approved!")
                .message("Your ownership claim for 'Campus Student ID Card' has been approved by Admin Officer Sharma.")
                .type("CLAIM_STATUS")
                .isRead(false)
                .relatedItemId(foundIdCard.getId())
                .build());

        notificationRepository.save(Notification.builder()
                .user(rohan)
                .title("Item Returned Successfully")
                .message("Your item 'Campus Student ID Card' has been handed over at Security Main Gate Office.")
                .type("ITEM_RETURNED")
                .isRead(true)
                .relatedItemId(foundIdCard.getId())
                .build());

        log.info("CampusFind sample data seeded successfully!");
    }
}
